import Notification from "../models/Notification.js";

/* ================= GET USER NOTIFICATIONS ================= */

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= MARK AS READ ================= */

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    notification.isRead = true;

    await notification.save();

    res.json({ message: "Marked as read" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CREATE TEST NOTIFICATION ================= */

export const createTestNotification = async (req, res) => {
  try {
    const notification = await Notification.create({
      user: req.user.id,
      title: "Test Notification",
      message: "This is a sample alert",
      type: "GENERAL"
    });

    res.status(201).json(notification);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};