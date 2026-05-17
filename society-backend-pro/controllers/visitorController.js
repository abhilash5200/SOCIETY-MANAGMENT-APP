import Visitor from "../models/Visitor.js";
import User from "../models/User.js";

/* ================= GUARD ADDS VISITOR ================= */

export const addVisitor = async (req, res) => {
  try {
    const { name, phone, vehicleNumber, purpose, flatId } = req.body;

    const visitor = await Visitor.create({
      name,
      phone,
      vehicleNumber,
      purpose,
      flat: flatId,
      entryBy: req.user.id
    });

    res.status(201).json({
      message: "Visitor request created (awaiting approval)",
      visitor
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= RESIDENT APPROVES ================= */

export const approveVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor)
      return res.status(404).json({ message: "Visitor not found" });

    visitor.status = "APPROVED";
    visitor.approvedBy = req.user.id;

    await visitor.save();

    res.json({ message: "Visitor approved" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= RESIDENT REJECTS ================= */

export const rejectVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    visitor.status = "REJECTED";
    visitor.approvedBy = req.user.id;

    await visitor.save();

    res.json({ message: "Visitor rejected" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GUARD MARK ENTRY ================= */

export const allowEntry = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (visitor.status !== "APPROVED")
      return res.status(400).json({
        message: "Visitor not approved"
      });

    visitor.status = "INSIDE";
    visitor.entryTime = new Date();

    await visitor.save();

    res.json({ message: "Visitor entered society" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GUARD CHECKOUT ================= */

export const checkoutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    visitor.status = "EXITED";
    visitor.exitTime = new Date();

    await visitor.save();

    res.json({ message: "Visitor checked out" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ROLE-BASED VIEW ================= */

export const getVisitors = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("flat");

    let visitors;

    if (req.user.role === "ADMIN" || req.user.role === "GUARD") {
      visitors = await Visitor.find().populate("flat entryBy approvedBy");
    }

    else if (req.user.role === "RESIDENT") {
      visitors = await Visitor.find({ flat: user.flat })
        .populate("entryBy approvedBy");
    }

    res.json(visitors);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};