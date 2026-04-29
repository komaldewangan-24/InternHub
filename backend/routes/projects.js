const express = require('express');
const router = express.Router();
const ProjectSubmission = require('../models/ProjectSubmission');
const Setting = require('../models/Setting');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const {
    notifyProjectResubmitted,
    notifyProjectReviewed,
    notifyProjectSubmitted,
} = require('../utils/notifications');
const { sendCsv } = require('../utils/csv');

const projectPopulate = [
    { path: 'student', select: 'name email role profile' },
    { path: 'faculty', select: 'name email role profile' },
    { path: 'versions.submittedBy', select: 'name email role' },
    { path: 'comments.author', select: 'name email role' },
];

const normalizeStringArray = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => String(item).trim())
        .filter(Boolean);
};

const appendVersion = (submission, submittedBy, submittedAt = new Date()) => {
    submission.versions.push({
        versionNumber: submission.currentVersion,
        title: submission.title,
        description: submission.description,
        links: submission.links,
        tags: submission.tags,
        submittedAt,
        submittedBy,
    });
};

const canViewSubmission = async (submission, user) => {
    if (!submission || !user) {
        return false;
    }

    if (user.role === 'admin') {
        return true;
    }

    if (user.role === 'student') {
        return String(submission.student._id || submission.student) === String(user.id);
    }

    if (user.role === 'faculty') {
        const isProjectFaculty = String(submission.faculty._id || submission.faculty) === String(user.id);
        const isStudentAssignedFaculty = submission.student?.profile?.assignedFaculty && 
            String(submission.student.profile.assignedFaculty._id || submission.student.profile.assignedFaculty) === String(user.id);
        
        return isProjectFaculty || isStudentAssignedFaculty;
    }

    if (user.role === 'recruiter') {
        const isApproved = submission.status === 'approved';
        if (!isApproved) return false;

        const Internship = require('../models/Internship');
        const Application = require('../models/Application');
        const recruiterInternships = await Internship.find({ user: user.id }).select('_id');
        const internshipIds = recruiterInternships.map((i) => i._id);
        const hasApplied = await Application.exists({
            user: submission.student._id || submission.student,
            internship: { $in: internshipIds },
        });

        return hasApplied;
    }

    return false;
};

const getSettings = async () => {
    let settings = await Setting.findOne();
    if (!settings) {
        settings = await Setting.create({});
    }
    return settings;
};

const buildReviewDueAt = async () => {
    const settings = await getSettings();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(settings.projectReviewSlaDays || 7));
    return dueDate;
};

router.get('/', protect, async (req, res) => {
    try {
        const { studentId, status, facultyId, overdue, q } = req.query;
        const query = {};

        if (req.user.role === 'student') {
            query.student = req.user.id;
        } else if (req.user.role === 'faculty') {
            const assignedStudents = await User.find({ 'profile.assignedFaculty': req.user.id }).select('_id');
            const studentIds = assignedStudents.map(s => s._id);
            query.$or = [
                { faculty: req.user.id },
                { student: { $in: studentIds } }
            ];
        } else if (req.user.role === 'recruiter') {
            const recruiterInternships = await Internship.find({ user: req.user.id }).select('_id');
            const internshipIds = recruiterInternships.map((i) => i._id);
            const applications = await Application.find({ internship: { $in: internshipIds } }).select('user');
            const applicantIds = applications.map((a) => a.user);
            
            query.status = 'approved';
            query.student = { $in: applicantIds };
        }

        if (studentId && req.user.role !== 'student') {
            query.student = studentId;
        }

        if (facultyId && req.user.role === 'admin') {
            query.faculty = facultyId;
        }

        if (status) {
            if (req.user.role === 'recruiter' && status !== 'approved') {
                return res.status(403).json({ success: false, error: 'Recruiters can only view approved submissions' });
            }

            query.status = status;
        }

        if (String(overdue) === 'true') {
            if (!['faculty', 'admin'].includes(req.user.role)) {
                return res.status(403).json({ success: false, error: 'Only faculty and admins can view overdue project reviews' });
            }

            query.status = 'submitted';
            query.reviewDueAt = { $lt: new Date() };
        }

        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { tags: { $elemMatch: { $regex: q, $options: 'i' } } },
            ];
        }

        const submissions = await ProjectSubmission.find(query)
            .populate(projectPopulate)
            .sort('-updatedAt');

        res.status(200).json({
            success: true,
            count: submissions.length,
            data: submissions,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.get('/faculty/queue', protect, authorize('faculty', 'admin'), async (req, res) => {
    try {
        const query = { status: 'submitted' };
        if (req.user.role === 'faculty') {
            const assignedStudents = await User.find({ 'profile.assignedFaculty': req.user.id }).select('_id');
            const studentIds = assignedStudents.map(s => s._id);
            query.$or = [
                { faculty: req.user.id },
                { student: { $in: studentIds } }
            ];
        }

        if (String(req.query.overdue) === 'true') {
            query.reviewDueAt = { $lt: new Date() };
        }

        const submissions = await ProjectSubmission.find(query)
            .populate(projectPopulate)
            .sort('-lastSubmittedAt');

        res.status(200).json({
            success: true,
            count: submissions.length,
            data: submissions,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.get('/export/approved', protect, authorize('admin'), async (req, res) => {
    try {
        const submissions = await ProjectSubmission.find({ status: 'approved' })
            .populate(projectPopulate)
            .sort('-approvedAt');

        const rows = submissions.map((submission) => ({
            studentName: submission.student?.name || '',
            studentEmail: submission.student?.email || '',
            department: submission.student?.profile?.department || '',
            facultyName: submission.faculty?.name || '',
            title: submission.title,
            tags: (submission.tags || []).join('; '),
            approvedAt: submission.approvedAt ? new Date(submission.approvedAt).toLocaleDateString() : '',
            rubricScore: submission.rubricScore || 0,
            links: (submission.links || []).join(' | '),
        }));

        sendCsv(
            res,
            'approved-projects.csv',
            [
                { key: 'studentName', label: 'Student' },
                { key: 'studentEmail', label: 'Email' },
                { key: 'department', label: 'Department' },
                { key: 'facultyName', label: 'Faculty' },
                { key: 'title', label: 'Project Title' },
                { key: 'tags', label: 'Tags' },
                { key: 'approvedAt', label: 'Approved At' },
                { key: 'rubricScore', label: 'Rubric Score' },
                { key: 'links', label: 'Links' },
            ],
            rows
        );
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.get('/export/review-backlog', protect, authorize('admin'), async (req, res) => {
    try {
        const submissions = await ProjectSubmission.find({ status: 'submitted' })
            .populate(projectPopulate)
            .sort('reviewDueAt');

        const rows = submissions.map((submission) => ({
            studentName: submission.student?.name || '',
            department: submission.student?.profile?.department || '',
            facultyName: submission.faculty?.name || '',
            title: submission.title,
            submittedAt: submission.lastSubmittedAt ? new Date(submission.lastSubmittedAt).toLocaleDateString() : '',
            reviewDueAt: submission.reviewDueAt ? new Date(submission.reviewDueAt).toLocaleDateString() : '',
            overdue: submission.reviewDueAt && submission.reviewDueAt < new Date() ? 'Yes' : 'No',
        }));

        sendCsv(
            res,
            'faculty-review-backlog.csv',
            [
                { key: 'studentName', label: 'Student' },
                { key: 'department', label: 'Department' },
                { key: 'facultyName', label: 'Faculty' },
                { key: 'title', label: 'Project Title' },
                { key: 'submittedAt', label: 'Submitted At' },
                { key: 'reviewDueAt', label: 'Review Due At' },
                { key: 'overdue', label: 'Overdue' },
            ],
            rows
        );
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.get('/:id', protect, async (req, res) => {
    try {
        const submission = await ProjectSubmission.findById(req.params.id).populate(projectPopulate);

        if (!submission) {
            return res.status(404).json({ success: false, error: 'Project submission not found' });
        }

        if (!(await canViewSubmission(submission, req.user))) {
            return res.status(403).json({ success: false, error: 'You are not allowed to view this submission' });
        }

        res.status(200).json({
            success: true,
            data: submission,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post('/', protect, authorize('student'), async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const facultyId = req.body.faculty || currentUser?.profile?.assignedFaculty;
        const { title, description } = req.body;

        const facultyUser = await User.findById(facultyId);
        if (!facultyUser || facultyUser.role !== 'faculty') {
            return res.status(400).json({ success: false, error: 'Please assign a valid faculty reviewer' });
        }

        const submission = await ProjectSubmission.create({
            student: req.user.id,
            faculty: facultyId,
            title,
            description,
            links: normalizeStringArray(req.body.links),
            tags: normalizeStringArray(req.body.tags),
            currentVersion: 1,
        });

        submission.versions.push({
            versionNumber: 1,
            title: submission.title,
            description: submission.description,
            links: submission.links,
            tags: submission.tags,
            submittedBy: req.user.id,
        });

        await submission.save();

        const fullSubmission = await ProjectSubmission.findById(submission._id).populate(projectPopulate);

        res.status(201).json({
            success: true,
            data: fullSubmission,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.put('/:id', protect, authorize('student'), async (req, res) => {
    try {
        const submission = await ProjectSubmission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({ success: false, error: 'Project submission not found' });
        }

        if (String(submission.student) !== String(req.user.id)) {
            return res.status(403).json({ success: false, error: 'You are not allowed to edit this submission' });
        }

        if (submission.status === 'approved') {
            return res.status(400).json({ success: false, error: 'Approved submissions can not be edited' });
        }

        if (req.body.faculty) {
            const facultyUser = await User.findById(req.body.faculty);
            if (!facultyUser || facultyUser.role !== 'faculty') {
                return res.status(400).json({ success: false, error: 'Please assign a valid faculty reviewer' });
            }
            submission.faculty = req.body.faculty;
        }

        submission.title = req.body.title || submission.title;
        submission.description = req.body.description || submission.description;
        if (req.body.links) {
            submission.links = normalizeStringArray(req.body.links);
        }
        if (req.body.tags) {
            submission.tags = normalizeStringArray(req.body.tags);
        }

        const existingVersion = submission.versions.find(
            (version) => version.versionNumber === submission.currentVersion
        );

        if (existingVersion) {
            existingVersion.title = submission.title;
            existingVersion.description = submission.description;
            existingVersion.links = submission.links;
            existingVersion.tags = submission.tags;
        }

        await submission.save();

        const fullSubmission = await ProjectSubmission.findById(submission._id).populate(projectPopulate);

        res.status(200).json({
            success: true,
            data: fullSubmission,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post('/:id/submit', protect, authorize('student'), async (req, res) => {
    try {
        const submission = await ProjectSubmission.findById(req.params.id).populate(projectPopulate);

        if (!submission) {
            return res.status(404).json({ success: false, error: 'Project submission not found' });
        }

        if (String(submission.student._id || submission.student) !== String(req.user.id)) {
            return res.status(403).json({ success: false, error: 'You are not allowed to submit this project' });
        }

        if (submission.status !== 'draft') {
            return res.status(400).json({ success: false, error: 'Only draft submissions can be submitted' });
        }

        submission.status = 'submitted';
        submission.lastSubmittedAt = new Date();
        submission.reviewDueAt = await buildReviewDueAt();

        const existingVersion = submission.versions.find(
            (version) => version.versionNumber === submission.currentVersion
        );

        if (existingVersion) {
            existingVersion.submittedAt = submission.lastSubmittedAt;
        } else {
            appendVersion(submission, req.user.id, submission.lastSubmittedAt);
        }

        await submission.save();

        await notifyProjectSubmitted({
            submission,
            actorId: req.user.id,
        });

        const fullSubmission = await ProjectSubmission.findById(submission._id).populate(projectPopulate);

        res.status(200).json({
            success: true,
            data: fullSubmission,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post('/:id/resubmit', protect, authorize('student'), async (req, res) => {
    try {
        const submission = await ProjectSubmission.findById(req.params.id).populate(projectPopulate);

        if (!submission) {
            return res.status(404).json({ success: false, error: 'Project submission not found' });
        }

        if (String(submission.student._id || submission.student) !== String(req.user.id)) {
            return res.status(403).json({ success: false, error: 'You are not allowed to resubmit this project' });
        }

        if (submission.status !== 'needs_resubmission') {
            return res.status(400).json({ success: false, error: 'Only submissions marked for resubmission can be resubmitted' });
        }

        submission.title = req.body.title || submission.title;
        submission.description = req.body.description || submission.description;
        submission.links = req.body.links ? normalizeStringArray(req.body.links) : submission.links;
        submission.tags = req.body.tags ? normalizeStringArray(req.body.tags) : submission.tags;
        submission.currentVersion += 1;
        submission.status = 'submitted';
        submission.lastSubmittedAt = new Date();
        submission.reviewDueAt = await buildReviewDueAt();
        appendVersion(submission, req.user.id, submission.lastSubmittedAt);

        await submission.save();

        await notifyProjectResubmitted({
            submission,
            actorId: req.user.id,
        });

        const fullSubmission = await ProjectSubmission.findById(submission._id).populate(projectPopulate);

        res.status(200).json({
            success: true,
            data: fullSubmission,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post('/:id/review', protect, authorize('faculty', 'admin'), async (req, res) => {
    try {
        const submission = await ProjectSubmission.findById(req.params.id).populate(projectPopulate);

        if (!submission) {
            return res.status(404).json({ success: false, error: 'Project submission not found' });
        }

        if (
            req.user.role === 'faculty' &&
            String(submission.faculty._id || submission.faculty) !== String(req.user.id)
        ) {
            return res.status(403).json({ success: false, error: 'You are not assigned to this project' });
        }

        const action = req.body.action || 'commented';
        const message = String(req.body.message || '').trim();
        const rubricAssessment = Array.isArray(req.body.rubricAssessment) ? req.body.rubricAssessment : [];

        if (!['commented', 'needs_resubmission', 'approved'].includes(action)) {
            return res.status(400).json({ success: false, error: 'Invalid review action' });
        }

        if (!message && action !== 'approved') {
            return res.status(400).json({ success: false, error: 'Please include review feedback' });
        }

        if (message || action === 'approved') {
            submission.comments.push({
                author: req.user.id,
                message: message || 'Approved for recruiter visibility.',
                action,
            });
        }

        if (rubricAssessment.length) {
            submission.rubricAssessment = rubricAssessment.map((item) => ({
                criterion: item.criterion,
                score: Number(item.score) || 0,
                maxScore: Number(item.maxScore) || 5,
                note: item.note || '',
            }));
            submission.rubricScore = submission.rubricAssessment.reduce(
                (sum, item) => sum + Number(item.score || 0),
                0
            );
        }

        if (action === 'needs_resubmission') {
            submission.status = 'needs_resubmission';
        } else if (action === 'approved') {
            submission.status = 'approved';
            submission.approvedAt = new Date();
            submission.reviewCompletedAt = submission.approvedAt;
            if (submission.lastSubmittedAt) {
                const durationMs = submission.reviewCompletedAt.getTime() - new Date(submission.lastSubmittedAt).getTime();
                submission.turnaroundDays = Number((durationMs / (1000 * 60 * 60 * 24)).toFixed(1));
            }
        }

        await submission.save();

        await notifyProjectReviewed({
            submission,
            actorId: req.user.id,
            action,
            message,
        });

        const fullSubmission = await ProjectSubmission.findById(submission._id).populate(projectPopulate);

        res.status(200).json({
            success: true,
            data: fullSubmission,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const submission = await ProjectSubmission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({ success: false, error: 'Project submission not found' });
        }

        const isOwner = String(submission.student) === String(req.user.id);
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, error: 'You are not allowed to delete this project' });
        }

        if (submission.status === 'approved' && !isAdmin) {
            return res.status(400).json({ success: false, error: 'Approved projects cannot be deleted by students' });
        }

        await ProjectSubmission.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
