import User from "../models/User.js";

/* ================= UPDATE PROFILE ================= */

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, emergencyContact, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, emergencyContact, profileImage },
      { new: true }
    );

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET DIRECTORY ================= */

export const getResidents = async (req, res) => {
  try {
    const residents = await User.find({ role: "RESIDENT" })
      .populate("flat")
      .select("-password");

    res.json(residents);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};