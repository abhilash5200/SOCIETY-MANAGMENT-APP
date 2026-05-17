import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ================= REGISTER ================= */

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= LOGIN ================= */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const populatedUser = await User.findById(user._id)
  .populate("flat");

    res.json({
      message: "Login successful",
      token,
      user: populatedUser
     });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};