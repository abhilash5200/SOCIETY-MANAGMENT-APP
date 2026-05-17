import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: true
    },

    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM"
    },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN"
    },

    resolvedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);