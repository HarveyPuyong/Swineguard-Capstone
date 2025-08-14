const notificationDB = require('./../models/notificationModel');

// Send Notification
exports.sendNotification = async (req, res) => {
    try {
        const { from, to, title, content } = req.body;

        // Validate input
        if (!from || !to || !title || !content) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newNotification = new notificationDB({
            from,   // e.g. user ID or ROLE_LIST.User
            to,     // e.g. ROLE_LIST.AppointmentCoordinator
            title,
            content
        });

        await newNotification.save();
        return res.status(201).json({ message: "Notification sent successfully." });

    } catch (err) {
        console.error("❌ Error sending notification:", err);
        return res.status(500).json({ message: "Something went wrong while sending notification." });
    }
};

// Mark Notification as Read
exports.readNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await notificationDB.findByIdAndUpdate(id, { isRead: true }, { new: true });
        return res.status(200).json({ message: "Notification marked as read." });
    } catch (err) {
        console.error("❌ Error reading notification:", err);
        return res.status(500).json({ error: "Failed to read notification" });
    }
};

// Get Notifications (optionally filtered by role or user)
exports.getNotification = async (req, res) => {
    try {
        const { to } = req.query; // optional filter, e.g. ?to=appointmentCoordinator
        const filter = to ? { to } : {};
        const notifications = await notificationDB.find(filter).sort({ createdAt: -1 });
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
