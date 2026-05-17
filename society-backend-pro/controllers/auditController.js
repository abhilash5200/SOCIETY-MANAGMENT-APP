import AuditLog from "../models/AuditLog.js";

/* ================= GET LOGS ================= */

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user", "name role")
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};