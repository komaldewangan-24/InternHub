const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        actor: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        type: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: 'system',
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        link: {
            type: String,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        entityType: {
            type: String,
            trim: true,
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        readAt: Date,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notification', NotificationSchema);
