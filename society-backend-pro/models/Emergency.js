import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["MEDICAL", "FIRE", "SECURITY", "PANIC", "OTHER"],
      required: true
    },

    description: String,

    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat"
    },

    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    status: {
      type: String,
      enum: ["ACTIVE", "RESPONDING", "RESOLVED"],
      default: "ACTIVE"
    },

    resolvedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Emergency", emergencySchema);