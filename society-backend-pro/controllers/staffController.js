import bcrypt from "bcrypt";
import User from "../models/User.js";

/* ================= ADMIN CREATES STAFF ================= */

export const createStaff = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "STAFF"
    });

    res.status(201).json({
      message: "Staff created successfully",
      staff
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL STAFF ================= */

export const getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "STAFF" });

    res.json(staff);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};