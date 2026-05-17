import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true
    },

    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat"
    },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    date: {
      type: Date,
      required: true
    },

    timeSlot: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);