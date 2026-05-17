import Emergency from "../models/Emergency.js";
import User from "../models/User.js";

/* ================= RESIDENT SENDS ALERT ================= */

export const raiseEmergency = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const { type, description } = req.body;

    const alert = await Emergency.create({
      type,
      description,
      flat: user.flat,
      raisedBy: req.user.id
    });

    res.status(201).json(alert);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GUARD RESPONDS ================= */

export const respondEmergency = async (req, res) => {
  try {
    const alert = await Emergency.findById(req.params.id);

    alert.status = "RESPONDING";
    alert.handledBy = req.user.id;

    await alert.save();

    res.json({ message: "Response initiated" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= RESOLVE ================= */

export const resolveEmergency = async (req, res) => {
  try {
    const alert = await Emergency.findById(req.params.id);

    alert.status = "RESOLVED";
    alert.resolvedAt = new Date();

    await alert.save();

    res.json({ message: "Emergency resolved" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= VIEW ALERTS ================= */

export const getEmergencies = async (req, res) => {
  try {
    let alerts;

    if (req.user.role === "ADMIN" || req.user.role === "GUARD") {
      alerts = await Emergency.find()
        .populate("flat raisedBy handledBy")
        .sort({ createdAt: -1 });
    }

    else if (req.user.role === "RESIDENT") {
      alerts = await Emergency.find({ raisedBy: req.user.id });
    }

    res.json(alerts);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};