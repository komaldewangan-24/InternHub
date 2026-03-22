const Notification = require('../models/Notification');

const createNotification = async ({
    recipient,
    actor,
    type,
    title,
    message,
    link,
    metadata = {},
}) => {
    if (!recipient) {
        return null;
    }

    return Notification.create({
        recipient,
        actor,
        type,
        title,
        message,
        link,
        metadata,
    });
};

const createBulkNotifications = async (notifications) => {
    const filtered = notifications.filter((item) => item && item.recipient);
    if (!filtered.length) {
        return [];
    }

    return Notification.insertMany(filtered);
};

module.exports = {
    createNotification,
    createBulkNotifications,
};
