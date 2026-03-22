const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 20, 50);
        const notifications = await Notification.find({ recipient: req.user.id })
            .populate('actor', 'name email role')
            .sort('-createdAt')
            .limit(limit);

        const unreadCount = await Notification.countDocuments({
            recipient: req.user.id,
            readAt: { $exists: false },
        });

        res.status(200).json({
            success: true,
            unreadCount,
            count: notifications.length,
            data: notifications,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user.id,
        });

        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        notification.readAt = notification.readAt || new Date();
        await notification.save();

        res.status(200).json({
            success: true,
            data: notification,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post('/read-all', protect, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, readAt: { $exists: false } },
            { $set: { readAt: new Date() } }
        );

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
