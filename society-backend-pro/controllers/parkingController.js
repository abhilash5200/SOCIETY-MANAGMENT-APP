import Parking from "../models/Parking.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

/* ================= CREATE SLOT ================= */

export const createSlot = async (req, res) => {

  try {

    const { slotNumber, type } = req.body;

    const slot = await Parking.create({
      slotNumber,
      type
    });

    res.status(201).json(slot);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};


/* ================= ASSIGN SLOT TO FLAT ================= */

export const assignSlot = async (req, res) => {

  try {

    const { flatId } = req.body;

    const slot = await Parking.findById(
      req.params.id
    );

    slot.flat = flatId;

    await slot.save();

    res.json({
      message: "Slot assigned to flat"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};


/* ================= REGISTER VEHICLE ================= */

export const registerVehicle = async (req, res) => {

  try {

    const user = await User.findById(
      req.user.id
    );

    const { number, type } = req.body;

    const vehicle = await Vehicle.create({

      number,
      type,

      owner: req.user.id,

      flat: user.flat

    });

    res.status(201).json(vehicle);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};


/* ================= GET MY VEHICLES ================= */

export const getVehicles = async (req, res) => {

  try {

    const vehicles = await Vehicle.find({
      owner: req.user.id
    });

    res.json(vehicles);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};


/* ================= GET SLOTS ================= */

export const getSlots = async (req, res) => {

  try {

    // ================= ADMIN =================

    if (req.user.role === "ADMIN") {

      const slots = await Parking.find()

        .populate("flat")

        .populate("assignedVehicle");

      return res.json(slots);
    }

    // ================= RESIDENT =================

if (req.user.role === "RESIDENT") {

  const user = await User.findById(
    req.user.id
  );

  const allSlots = await Parking.find()

    .populate("flat")

    .populate("assignedVehicle");

  const slots = allSlots.filter(slot => {

    if (!slot.flat) return false;

    return (
      slot.flat._id.toString() ===
      user.flat.toString()
    );

  });

  return res.json(slots);
}

    // ================= OTHERS =================

    return res.json([]);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};