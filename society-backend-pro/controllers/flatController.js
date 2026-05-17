import Flat from "../models/Flat.js";

/* ================= CREATE FLAT ================= */

export const createFlat = async (req, res) => {
  try {
    const { block, flatNumber, floor } = req.body;

    const flat = await Flat.create({
      block,
      flatNumber,
      floor
    });

    res.status(201).json(flat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL FLATS ================= */

export const getAllFlats = async (req, res) => {
  try {
    const flats = await Flat.find()
      .populate("owner", "name email")
      .populate("residents", "name email");

    res.json(flats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};