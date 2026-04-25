const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Internship = require('../models/Internship');
const Company = require('../models/Company');
const Application = require('../models/Application');
const ProjectSubmission = require('../models/ProjectSubmission');
const { protect, authorize } = require('../middleware/auth');
const { getAllowedRecipientRoles } = require('../utils/permissions');
const { computeStudentReadiness } = require('../utils/readiness');
const { createBulkNotifications } = require('../utils/notifications');
const { sendCsv } = require('../utils/csv');

const publicStudentProfile = (student) => ({
    _id: student._id,
    id: student._id,
    name: student.name,
    email: student.email,
    role: student.role,
    profile: {
        department: student.profile?.department,
        batch: student.profile?.batch,
        university: student.profile?.university,
        degree: student.profile?.degree,
        location: student.profile?.location,
        skills: student.profile?.skills || [],
        resumeUrl: student.profile?.resumeUrl,
        avatarUrl: student.profile?.avatarUrl,
        achievementsSummary: student.profile?.achievementsSummary,
        achievementsImageUrl: student.profile?.achievementsImageUrl,
        certifications: student.profile?.certifications || [],
        achievements: student.profile?.achievements || [],
        assignedFaculty: student.profile?.assignedFaculty,
    },
});

const getReadinessMaps = async () => {
    const [approvedProjects, applications] = await Promise.all([
        ProjectSubmission.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: '$student', count: { $sum: 1 } } },
        ]),
        Application.aggregate([
            { $group: { _id: '$user', count: { $sum: 1 } } },
        ]),
    ]);

    const approvedProjectMap = new Map(
        approvedProjects.map((item) => [String(item._id), item.count])
    );
    const applicationMap = new Map(
        applications.map((item) => [String(item._id), item.count])
    );

    return { approvedProjectMap, applicationMap };
};

router.get('/stats', protect, authorize('admin'), async (req, res) => {
    try {
        const [
            students,
            totalFaculty,
            totalRecruiters,
            totalCompanies,
            totalInternships,
            totalApplications,
            placedStudents,
            totalProjects,
            approvedProjects,
            pendingProjectReviews,
            inactiveRecruiters,
            overdueProjectReviews,
            approvedReviewTimes,
        ] = await Promise.all([
            User.find({ role: 'student' }).populate('profile.assignedFaculty', 'name email role'),
            User.countDocuments({ role: 'faculty' }),
            User.countDocuments({ role: 'recruiter' }),
            Company.countDocuments(),
            Internship.countDocuments(),
            Application.countDocuments(),
            Application.countDocuments({ status: 'selected' }),
            ProjectSubmission.countDocuments(),
            ProjectSubmission.countDocuments({ status: 'approved' }),
            ProjectSubmission.countDocuments({ status: 'submitted' }),
            User.aggregate([
                { $match: { role: 'recruiter' } },
                {
                    $lookup: {
                        from: 'internships',
                        localField: '_id',
                        foreignField: 'user',
                        as: 'internships',
                    },
                },
                {
                    $match: {
                        $expr: { $eq: [{ $size: '$internships' }, 0] },
                    },
                },
                { $count: 'count' },
            ]),
            ProjectSubmission.countDocuments({
                status: 'submitted',
                reviewDueAt: { $lt: new Date() },
            }),
            ProjectSubmission.find({
                status: 'approved',
                turnaroundDays: { $exists: true },
            }).select('turnaroundDays'),
        ]);

        const { approvedProjectMap, applicationMap } = await getReadinessMaps();
        const readiness = students.map((student) =>
            computeStudentReadiness({
                user: student,
                approvedProjectsCount: approvedProjectMap.get(String(student._id)) || 0,
                applicationCount: applicationMap.get(String(student._id)) || 0,
            })
        );

        const readyStudents = readiness.filter((item) => item.isPlacementReady).length;
        const studentsMissingResume = readiness.filter((item) => item.flags.includes('resume_missing')).length;
        const studentsWithoutApprovedProjects = readiness.filter((item) => item.flags.includes('project_not_approved')).length;
        const lowApplicationActivity = readiness.filter((item) => item.flags.includes('application_inactive')).length;
        const averageReviewTurnaroundDays = approvedReviewTimes.length
            ? Number(
                (
                    approvedReviewTimes.reduce((sum, item) => sum + Number(item.turnaroundDays || 0), 0) /
                    approvedReviewTimes.length
                ).toFixed(1)
            )
            : 0;

        res.status(200).json({
            success: true,
            data: {
                totalStudents: students.length,
                totalFaculty,
                totalRecruiters,
                totalCompanies,
                totalInternships,
                totalApplications,
                totalProjects,
                approvedProjects,
                pendingProjectReviews,
                readyStudents,
                studentsMissingResume,
                studentsWithoutApprovedProjects,
                lowApplicationActivity,
                overdueProjectReviews,
                averageReviewTurnaroundDays,
                inactiveRecruiters: inactiveRecruiters[0]?.count || 0,
                placedRate: students.length > 0 ? ((placedStudents / students.length) * 100).toFixed(1) : 0,
            },
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.get('/search', protect, async (req, res) => {
    try {
        const query = String(req.query.q || '').trim();
        const role = String(req.query.role || '').trim();

        let allowedRoles;
        if (req.user.role === 'admin') {
            allowedRoles = role ? [role] : ['student', 'faculty', 'recruiter', 'admin'];
        } else {
            allowedRoles = getAllowedRecipientRoles(req.user.role);
            if (role) {
                allowedRoles = allowedRoles.filter((item) => item === role);
            }
        }

        if (!allowedRoles.length) {
            return res.status(200).json({ success: true, data: [] });
        }

        const mongoQuery = {
            role: { $in: allowedRoles },
            _id: { $ne: req.user.id },
        };

        if (query) {
            mongoQuery.$or = [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { 'profile.department': { $regex: query, $options: 'i' } },
            ];
        }

        const users = await User.find(mongoQuery)
            .select('name email role profile.department profile.designation profile.avatarUrl')
            .populate('profile.assignedFaculty', 'name email role')
            .limit(25)
            .sort('name');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.get('/portfolio/:id', protect, async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id).populate('profile.assignedFaculty', 'name email role profile.department profile.designation');
        if (!targetUser) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        if (targetUser.role !== 'student') {
            return res.status(400).json({ success: false, error: 'Portfolios are only available for student accounts' });
        }

        const isSelf = String(targetUser._id) === String(req.user.id);
        const isAssignedFaculty =
            req.user.role === 'faculty' &&
            String(targetUser.profile?.assignedFaculty?._id || targetUser.profile?.assignedFaculty || '') === String(req.user.id);
        let isRecruiterApplicant = false;
        if (req.user.role === 'recruiter') {
            const recruiterInternships = await Internship.find({ user: req.user.id }).select('_id');
            const internshipIds = recruiterInternships.map((internship) => internship._id);
            isRecruiterApplicant = Boolean(
                await Application.exists({
                    user: targetUser._id,
                    internship: { $in: internshipIds },
                })
            );
        }

        const canView = req.user.role === 'admin' || isRecruiterApplicant || isSelf || isAssignedFaculty;

        if (!canView) {
            return res.status(403).json({ success: false, error: 'You are not allowed to view this portfolio' });
        }

        const approvedProjects = await ProjectSubmission.find({
            student: targetUser._id,
            status: 'approved',
        })
            .select('title description links tags faculty approvedAt rubricScore')
            .populate('faculty', 'name email role profile.designation')
            .sort('-approvedAt');

        const applicationCount = await Application.countDocuments({ user: targetUser._id });
        const readiness = computeStudentReadiness({
            user: targetUser,
            approvedProjectsCount: approvedProjects.length,
            applicationCount,
        });

        res.status(200).json({
            success: true,
            data: {
                student: req.user.role === 'admin' || isSelf || isAssignedFaculty
                    ? targetUser
                    : publicStudentProfile(targetUser),
                approvedProjects,
                readiness,
            },
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.get('/export/students', protect, authorize('admin'), async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).populate('profile.assignedFaculty', 'name');
        const { approvedProjectMap, applicationMap } = await getReadinessMaps();

        const rows = students.map((student) => {
            const readiness = computeStudentReadiness({
                user: student,
                approvedProjectsCount: approvedProjectMap.get(String(student._id)) || 0,
                applicationCount: applicationMap.get(String(student._id)) || 0,
            });

            return {
                name: student.name,
                email: student.email,
                department: student.profile?.department || '',
                batch: student.profile?.batch || '',
                assignedFaculty: student.profile?.assignedFaculty?.name || '',
                profileCompletion: readiness.profileCompletion,
                approvedProjects: readiness.approvedProjectsCount,
                applications: readiness.applicationCount,
                readinessScore: readiness.score,
                placementReady: readiness.isPlacementReady ? 'Yes' : 'No',
                flags: readiness.flags.join('; '),
            };
        });

        sendCsv(
            res,
            'students-readiness.csv',
            [
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'department', label: 'Department' },
                { key: 'batch', label: 'Batch' },
                { key: 'assignedFaculty', label: 'Assigned Faculty' },
                { key: 'profileCompletion', label: 'Profile Completion' },
                { key: 'approvedProjects', label: 'Approved Projects' },
                { key: 'applications', label: 'Applications' },
                { key: 'readinessScore', label: 'Readiness Score' },
                { key: 'placementReady', label: 'Placement Ready' },
                { key: 'flags', label: 'Flags' },
            ],
            rows
        );
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post('/faculty-assignments', protect, authorize('admin'), async (req, res) => {
    try {
        const { facultyId, studentIds = [], department = '' } = req.body;
        const faculty = await User.findById(facultyId);

        if (!faculty || faculty.role !== 'faculty') {
            return res.status(400).json({ success: false, error: 'Please select a valid faculty member' });
        }

        const studentQuery = { role: 'student' };
        if (studentIds.length) {
            studentQuery._id = { $in: studentIds };
        } else if (department) {
            studentQuery['profile.department'] = department;
        } else {
            return res.status(400).json({ success: false, error: 'Provide studentIds or department for assignment' });
        }

        const students = await User.find(studentQuery).select('_id name');
        if (!students.length) {
            return res.status(404).json({ success: false, error: 'No matching students found' });
        }

        await User.updateMany(studentQuery, {
            $set: {
                'profile.assignedFaculty': faculty._id,
            },
        });

        await createBulkNotifications(
            students.map((student) => ({
                recipient: student._id,
                actor: req.user.id,
                type: 'faculty_assigned',
                title: 'Faculty reviewer assigned',
                message: `${faculty.name} has been assigned as your default faculty reviewer.`,
                link: '/student/projects',
                metadata: { facultyId: faculty._id },
            }))
        );

        res.status(200).json({
            success: true,
            count: students.length,
            data: {
                facultyId: faculty._id,
                studentIds: students.map((student) => student._id),
            },
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find().populate('profile.assignedFaculty', 'name email role');
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { name, email, password, role, profile = {} } = req.body;
        if (!['student', 'faculty', 'recruiter', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, error: 'Invalid role provided' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            profile,
        });

        res.status(201).json({
            success: true,
            data: await User.findById(user._id).populate('profile.assignedFaculty', 'name email role'),
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.get('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('profile.assignedFaculty', 'name email role');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('profile.assignedFaculty', 'name email role');
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
