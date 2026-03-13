const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc      Get all messages (conversations) for current user
// @route     GET /api/messages
// @access    Private
router.get('/', protect, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { recipient: req.user.id }]
        })
        .populate('sender', 'name email role')
        .populate('recipient', 'name email role')
        .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Get conversation with a specific user
// @route     GET /api/messages/conversation/:userId
// @access    Private
router.get('/conversation/:userId', protect, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, recipient: req.params.userId },
                { sender: req.params.userId, recipient: req.user.id }
            ]
        })
        .populate('sender', 'name email role')
        .populate('recipient', 'name email role')
        .sort('createdAt');

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc      Send a message
// @route     POST /api/messages
// @access    Private
router.post('/', protect, async (req, res) => {
    try {
        const { recipient, content } = req.body;

        const message = await Message.create({
            sender: req.user.id,
            recipient,
            content
        });

        const fullMessage = await Message.findById(message._id)
            .populate('sender', 'name email role')
            .populate('recipient', 'name email role');

        res.status(201).json({
            success: true,
            data: fullMessage
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
