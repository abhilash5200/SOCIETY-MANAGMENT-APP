import User from "../models/User.js";
import Flat from "../models/Flat.js";

/* ================= ASSIGN RESIDENT TO FLAT ================= */

export const assignResident = async (req, res) => {
  try {
    const { userId, flatId, isOwner } = req.body;

    const user = await User.findById(userId);
    const flat = await Flat.findById(flatId);

    if (!user || !flat)
      return res.status(404).json({ message: "User or Flat not found" });

    if (user.role !== "RESIDENT")
      return res.status(400).json({ message: "User is not a resident" });

    /* Update User */

    user.flat = flatId;
    user.isOwner = isOwner;

    await user.save();

    /* Update Flat */

    flat.residents.push(userId);

    if (isOwner) flat.owner = userId;

    flat.isOccupied = true;

    await flat.save();

    res.json({
      message: "Resident assigned successfully"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ================= GET RESIDENTS =================

export const getResidents = async (req, res) => {

  try {

    const residents = await User.find({
      role: "RESIDENT"
    }).populate("flat");

    res.json(residents);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};