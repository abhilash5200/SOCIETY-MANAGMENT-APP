import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phone: { type: String, required: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["ADMIN", "RESIDENT", "GUARD", "STAFF"],
      default: "RESIDENT"
    },

    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      default: null
    },

    isOwner: {
      type: Boolean,
      default: false
    },

    profileImage: String,
    emergencyContact: String,

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);