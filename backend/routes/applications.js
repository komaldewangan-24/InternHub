const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const { protect, authorize } = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');
const { sendCsv } = require('../utils/csv');

const applicationPopulate = [
    {
        path: 'internship',
        populate: { path: 'company', select: 'name logoUrl verificationStatus' },
    },
    {
        path: 'user',
        select: 'name email role profile',
        populate: { path: 'profile.assignedFaculty', select: 'name email role' },
    },
];

router.get('/export', protect, authorize('admin'), async (req, res) => {
    try {
        const applications = await Application.find()
            .populate(applicationPopulate)
            .sort('-appliedAt');

        const rows = applications.map((application) => ({
            studentName: application.user?.name || '',
            studentEmail: application.user?.email || '',
            department: application.user?.profile?.department || '',
            internshipTitle: application.internship?.title || '',
            companyName: application.internship?.company?.name || '',
            status: application.status,
            appliedAt: application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : '',
        }));

        sendCsv(
            res,
            'applications-report.csv',
            [
                { key: 'studentName', label: 'Student' },
                { key: 'studentEmail', label: 'Email' },
                { key: 'department', label: 'Department' },
                { key: 'internshipTitle', label: 'Internship' },
                { key: 'companyName', label: 'Company' },
                { key: 'status', label: 'Status' },
                { key: 'appliedAt', label: 'Applied At' },
            ],
            rows
        );
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.get('/', protect, async (req, res) => {
    try {
        let applications;

        if (req.user.role === 'admin') {
            applications = await Application.find()
                .populate(applicationPopulate)
                .sort('-appliedAt');
        } else if (req.user.role === 'student') {
            applications = await Application.find({ user: req.user.id })
                .populate(applicationPopulate)
                .sort('-appliedAt');
        } else if (req.user.role === 'recruiter') {
            const recruiterInternships = await Internship.find({ user: req.user.id }).select('_id');
            const internshipIds = recruiterInternships.map((internship) => internship._id);

            applications = await Application.find({ internship: { $in: internshipIds } })
                .populate(applicationPopulate)
                .sort('-appliedAt');
        } else {
            return res.status(403).json({ success: false, error: 'User role is not authorized to view applications' });
        }

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post('/:internshipId', protect, authorize('student'), async (req, res) => {
    try {
        const existingApp = await Application.findOne({
            user: req.user.id,
            internship: req.params.internshipId,
        });

        if (existingApp) {
            return res.status(400).json({ success: false, error: 'You have already applied for this internship' });
        }

        if (!req.user.profile?.resumeUrl) {
            return res.status(400).json({
                success: false,
                error: 'Please upload your resume in your profile before applying for internships.',
            });
        }

        const internship = await Internship.findById(req.params.internshipId).populate('company', 'name');
        if (!internship) {
            return res.status(404).json({ success: false, error: 'Internship not found' });
        }

        const application = await Application.create({
            user: req.user.id,
            internship: req.params.internshipId,
        });

        await createNotification({
            recipient: internship.user,
            actor: req.user.id,
            type: 'application_submitted',
            title: 'New applicant received',
            message: `A student applied to "${internship.title}"${internship.company?.name ? ` at ${internship.company.name}` : ''}.`,
            link: '/recruiter/applicants',
            metadata: { applicationId: application._id, internshipId: internship._id },
        });

        res.status(201).json({
            success: true,
            data: application,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.put('/:id', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        let application = await Application.findById(req.params.id).populate(applicationPopulate);

        if (!application) {
            return res.status(404).json({ success: false, error: 'Application not found' });
        }

        if (req.user.role === 'recruiter') {
            const internship = await Internship.findById(application.internship?._id || application.internship);
            if (!internship || String(internship.user) !== String(req.user.id)) {
                return res.status(403).json({ success: false, error: 'You are not authorized to update this application' });
            }
        }

        application.status = req.body.status || application.status;
        await application.save();
        application = await Application.findById(req.params.id).populate(applicationPopulate);

        await createNotification({
            recipient: application.user?._id || application.user,
            actor: req.user.id,
            type: 'application_status_changed',
            title: 'Application status updated',
            message: `Your application for "${application.internship?.title || 'the internship'}" is now marked as ${application.status}.`,
            link: '/applications',
            metadata: { applicationId: application._id, status: application.status },
        });

        res.status(200).json({
            success: true,
            data: application,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
