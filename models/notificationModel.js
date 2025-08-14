const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({

    from: { type: String, required: true },
    to: { type: String, required: true },
    title: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    content: { type: String, required: true }

}, { collection: 'notifications', timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);