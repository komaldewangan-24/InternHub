const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

const profileFields = [
    'skills',
    'university',
    'degree',
    'resumeUrl',
    'resumeFileName',
    'resumeMimeType',
    'resumeUploadedAt',
    'phone',
    'bio',
    'location',
    'graduationDate',
    'department',
    'batch',
    'section',
    'rollNumber',
    'designation',
    'githubUrl',
    'linkedinUrl',
    'avatarUrl',
    'certifications',
    'achievements',
    'experience',
    'achievementsSummary',
    'achievementsImageUrl',
    'assignedFaculty',
];

const notificationCategoryKeys = [
    'internships',
    'applications',
    'projects',
    'messages',
    'company',
    'system',
];

const notificationPreferenceDefaults = {
    inAppEnabled: true,
    emailEnabled: true,
    categories: {
        internships: true,
        applications: true,
        projects: true,
        messages: true,
        company: true,
        system: true,
    },
};

const mergeNotificationPreferences = (incoming = {}, current = {}) => ({
    inAppEnabled:
        typeof incoming.inAppEnabled === 'boolean'
            ? incoming.inAppEnabled
            : (current.inAppEnabled ?? notificationPreferenceDefaults.inAppEnabled),
    emailEnabled:
        typeof incoming.emailEnabled === 'boolean'
            ? incoming.emailEnabled
            : (current.emailEnabled ?? notificationPreferenceDefaults.emailEnabled),
    categories: notificationCategoryKeys.reduce(
        (result, key) => ({
            ...result,
            [key]:
                typeof incoming.categories?.[key] === 'boolean'
                    ? incoming.categories[key]
                    : (current.categories?.[key] ?? notificationPreferenceDefaults.categories[key]),
        }),
        {}
    ),
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(statusCode).json({
        success: true,
        token,
        role: user.role,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

// @desc      Register user (Public - Students Only)
// @route     POST /api/auth/register
// @access    Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Force student role for public registration
        // Admin, Faculty, and Recruiters must be provisioned by an administrator
        const user = await User.create({
            name,
            email,
            password,
            role: 'student',
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
router.post('/login', async (req, res) => {
    try {
        const { email, password, selectedRole } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Role mismatch check
        if (selectedRole && user.role !== selectedRole) {
            return res.status(409).json({
                success: false,
                code: 'ROLE_MISMATCH',
                actualRole: user.role,
                selectedRole,
                message: `Your account is registered as a ${user.role}.`,
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Get current logged in user
// @route     GET /api/auth/me
// @access    Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('profile.assignedFaculty', 'name email role profile.department profile.designation');
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Update user details
// @route     PUT /api/auth/me
// @access    Private
router.put('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (req.body.name) {
            user.name = req.body.name;
        }

        if (req.body.email) {
            user.email = req.body.email;
        }

        if (req.body.profile) {
            user.profile = user.profile || {};
            profileFields.forEach((field) => {
                if (Object.prototype.hasOwnProperty.call(req.body.profile, field)) {
                    user.profile[field] = req.body.profile[field];
                }
            });
        }

        if (req.body.notificationPreferences) {
            user.notificationPreferences = mergeNotificationPreferences(
                req.body.notificationPreferences,
                user.notificationPreferences || {}
            );
        }

        await user.save();

        const updatedUser = await User.findById(req.user.id).populate('profile.assignedFaculty', 'name email role profile.department profile.designation');

        res.status(200).json({
            success: true,
            data: updatedUser,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
