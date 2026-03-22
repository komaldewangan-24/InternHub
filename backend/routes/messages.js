const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { canSendMessage } = require('../utils/permissions');
const { createNotification } = require('../utils/notifications');

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

        const recipientUser = await User.findById(recipient);
        if (!recipientUser) {
            return res.status(404).json({ success: false, error: 'Recipient not found' });
        }

        if (!canSendMessage(req.user.role, recipientUser.role)) {
            return res.status(403).json({ success: false, error: 'You are not allowed to message this user' });
        }

        const message = await Message.create({
            sender: req.user.id,
            recipient,
            content
        });

        const fullMessage = await Message.findById(message._id)
            .populate('sender', 'name email role')
            .populate('recipient', 'name email role');

        await createNotification({
            recipient,
            actor: req.user.id,
            type: 'new_message',
            title: 'New message received',
            message: `You have a new message from ${fullMessage.sender?.name || 'a user'}.`,
            link: '/messages',
            metadata: { messageId: fullMessage._id },
        });

        res.status(201).json({
            success: true,
            data: fullMessage
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
