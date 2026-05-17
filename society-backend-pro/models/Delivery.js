import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    courierName: {
      type: String,
      required: true
    },

    packageDetails: String,

    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: true
    },

    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    receivedAt: {
      type: Date,
      default: Date.now
    },

    collectedAt: Date,

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COLLECTED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Delivery", deliverySchema);