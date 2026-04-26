const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const ProjectSubmission = require('../models/ProjectSubmission');
const { protect, authorize } = require('../middleware/auth');
const { computeStudentReadiness } = require('../utils/readiness');

// @desc    Get student dashboard data
// @route   GET /api/student/dashboard
// @access  Private/Student
router.get('/dashboard', protect, authorize('student'), async (req, res) => {
    try {
        const [applications, projects, totalInternships, recommendations] = await Promise.all([
            Application.find({ user: req.user.id }).populate('internship'),
            ProjectSubmission.find({ student: req.user.id }),
            Internship.countDocuments({ status: 'open' }),
            // Content-based recommendations based on student skills
            (async () => {
                const skills = req.user.profile?.skills || [];
        const escapedSkills = skills.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);

                return await Internship.find({
                    status: 'open',
                    $or: [
                        { eligibleDepartments: { $in: [req.user.profile?.department] } },
                        { eligibleDepartments: { $exists: false } },
                        { eligibleDepartments: { $size: 0 } }
                    ],
                    ...(escapedSkills.length > 0 ? {
                        $or: [
                            { title: { $regex: escapedSkills.join('|'), $options: 'i' } },
                            { requirements: { $in: escapedSkills } }
                        ]
                    } : {})
                }).populate('company').limit(5).lean();
            })()
        ]);

        const approvedProjects = projects.filter(p => p.status === 'approved');
        
        const readiness = computeStudentReadiness({
            user: req.user,
            approvedProjectsCount: approvedProjects.length,
            applicationCount: applications.length
        });

        // Mock skill proficiency for now, or derive from project scores if available
        const skills = (req.user.profile?.skills || []).map(skill => {
            // Logic to determine proficiency: maybe based on approved projects with this tag
            const projectsWithSkill = approvedProjects.filter(p => p.tags?.includes(skill));
            const proficiency = projectsWithSkill.length > 0 ? Math.min(60 + (projectsWithSkill.length * 10), 95) : 40;
            return { label: skill, percentage: proficiency };
        });

        // Extract upcoming interviews from applications
        const interviews = applications
            .filter(app => app.status === 'interview' || app.status === 'selected')
            .map(app => ({
                id: app._id,
                title: app.internship?.title,
                company: app.internship?.company?.name || 'Partner Company',
                date: app.updatedAt, // Using updatedAt as a proxy for now, ideally an interview date field
                status: app.status
            }));

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    applications: applications.length,
                    underReview: projects.filter(p => p.status === 'submitted' || p.status === 'pending').length,
                    approved: approvedProjects.length,
                    totalInternships,
                    interviews: interviews.length
                },
                readiness,
                recommendations: recommendations.map(internship => ({
                    _id: internship._id,
                    title: internship.title,
                    company: internship.company?.name || 'Company',
                    location: internship.location,
                    salary: internship.stipend,
                    tags: internship.skillTags || [],
                    match: Math.floor(Math.random() * (98 - 85 + 1) + 85) // Mock match percentage for now
                })),
                skills: skills.length > 0 ? skills : [
                    { label: 'Technical Core', percentage: 40 },
                    { label: 'Soft Skills', percentage: 30 }
                ],
                upcomingInterviews: interviews.length > 0 ? interviews : [
                    {
                        title: 'Selection Round',
                        company: 'Institutional Review',
                        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'scheduled'
                    }
                ]
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Get student analytics
// @route   GET /api/student/analytics
// @access  Private/Student
router.get('/analytics', protect, authorize('student'), async (req, res) => {
    try {
        const [applications, projects] = await Promise.all([
            Application.find({ user: req.user.id }),
            ProjectSubmission.find({ student: req.user.id })
        ]);

        const approvedProjects = projects.filter(p => p.status === 'approved');
        
        const readiness = computeStudentReadiness({
            user: req.user,
            approvedProjectsCount: approvedProjects.length,
            applicationCount: applications.length
        });

        // Historical application data
        const applicationTrends = await Application.aggregate([
            { $match: { user: req.user._id } },
            { $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                count: { $sum: 1 }
            }},
            { $sort: { "_id": 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                readiness,
                applicationTrends,
                skillDistribution: (req.user.profile?.skills || []).map(s => ({ name: s, value: 1 }))
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
