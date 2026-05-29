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
      enum: ["CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "CONFIRMED"
    }
  },
  { timestamps: true }
);

bookingSchema.index({ facility: 1, date: 1, timeSlot: 1, status: 1 });
bookingSchema.index({ bookedBy: 1, date: 1 });

export default mongoose.model("Booking", bookingSchema);