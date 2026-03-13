const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin'), async (req, res) => {
    try {
        const User = require('../models/User');
        const Internship = require('../models/Internship');
        const Company = require('../models/Company');
        const Application = require('../models/Application');

        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCompanies = await Company.countDocuments();
        const totalInternships = await Internship.countDocuments();
        const totalApplications = await Application.countDocuments();
        const placedStudents = await Application.countDocuments({ status: 'selected' });

        res.status(200).json({
            success: true,
            data: {
                totalStudents,
                totalCompanies,
                totalInternships,
                totalApplications,
                placedRate: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Get all users
// @route     GET /api/users
// @access    Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Get single user
// @route     GET /api/users/:id
// @access    Private/Admin
router.get('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
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

// @desc      Update user
// @route     PUT /api/users/:id
// @access    Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Delete user
// @route     DELETE /api/users/:id
// @access    Private/Admin
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
