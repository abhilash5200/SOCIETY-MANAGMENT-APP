import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    phone: { type: String, required: true },

    vehicleNumber: String,

    purpose: String,

    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: true
    },

    entryBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    entryTime: Date,
    exitTime: Date,

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "INSIDE", "EXITED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Visitor", visitorSchema);