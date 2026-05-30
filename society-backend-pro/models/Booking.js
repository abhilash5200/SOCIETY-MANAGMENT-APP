import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // Facility Reference
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: [true, "Facility ID is required"],
      index: true
    },

    // Resident Information
    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: [true, "Flat ID is required"]
    },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true
    },

    // Booking Details
    date: {
      type: Date,
      required: [true, "Date is required"],
      index: true
    },

    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
      index: true
    },

    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    // Payment Information
    amount: {
      type: Number,
      default: 0,
      min: [0, "Amount cannot be negative"]
    },

    paymentStatus: {
      type: String,
      enum: {
        values: ["PENDING", "PAID", "FAILED", "REFUNDED"],
        message: "Payment status must be PENDING, PAID, FAILED, or REFUNDED"
      },
      default: "PENDING",
      index: true
    },

    paymentId: {
      type: String,
      default: null
    },

    paymentDetails: {
      method: {
        type: String,
        enum: ["CARD", "UPI", "WALLET", "BANK_TRANSFER", "CASH"],
        default: null
      },
      transactionId: String,
      paidAt: Date,
      refundedAt: Date,
      refundAmount: {
        type: Number,
        default: 0
      }
    },

    // Booking Status
    status: {
      type: String,
      enum: {
        values: ["CONFIRMED", "CANCELLED", "COMPLETED"],
        message: "Status must be CONFIRMED, CANCELLED, or COMPLETED"
      },
      default: "CONFIRMED",
      index: true
    },

    cancellationReason: String,
    cancelledAt: Date
  },
  { timestamps: true }
);

// Composite indexes for duplicate prevention and performance
bookingSchema.index({ facility: 1, date: 1, timeSlot: 1, status: 1 });
bookingSchema.index({ bookedBy: 1, facility: 1, date: 1, status: 1 });
bookingSchema.index({ date: 1, status: 1 });
bookingSchema.index({ paymentStatus: 1, status: 1 });

export default mongoose.model("Booking", bookingSchema);