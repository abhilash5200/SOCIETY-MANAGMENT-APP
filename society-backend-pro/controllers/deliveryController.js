import Delivery from "../models/Delivery.js";
import User from "../models/User.js";

/* ================= GUARD LOGS DELIVERY ================= */

export const addDelivery = async (req, res) => {
  try {
    const { courierName, packageDetails, flatId } = req.body;

    const delivery = await Delivery.create({
      courierName,
      packageDetails,
      flat: flatId,
      receivedBy: req.user.id
    });

    res.status(201).json({
      message: "Delivery logged (awaiting approval)",
      delivery
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= RESIDENT APPROVES ================= */

export const approveDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    delivery.status = "APPROVED";
    delivery.approvedBy = req.user.id;

    await delivery.save();

    res.json({ message: "Delivery approved" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= RESIDENT REJECTS ================= */

export const rejectDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    delivery.status = "REJECTED";
    delivery.approvedBy = req.user.id;

    await delivery.save();

    res.json({ message: "Delivery rejected" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= RESIDENT COLLECTS ================= */

export const collectDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (delivery.status !== "APPROVED")
      return res.status(400).json({
        message: "Delivery not approved"
      });

    delivery.status = "COLLECTED";
    delivery.collectedAt = new Date();

    await delivery.save();

    res.json({ message: "Delivery collected" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ROLE-BASED VIEW ================= */

export const getDeliveries = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("flat");

    let deliveries;

    if (req.user.role === "ADMIN" || req.user.role === "GUARD") {
      deliveries = await Delivery.find().populate("flat approvedBy");
    }

    else if (req.user.role === "RESIDENT") {
      deliveries = await Delivery.find({ flat: user.flat });
    }

    res.json(deliveries);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};