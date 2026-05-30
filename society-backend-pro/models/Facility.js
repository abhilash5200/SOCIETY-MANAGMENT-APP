import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format"]
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:MM format"]
    },
    capacity: {
      type: Number,
      required: [true, "Slot capacity is required"],
      min: [1, "Capacity must be at least 1"],
      default: 1
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { _id: true }
);

const facilitySchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Facility name is required"],
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },

    facilityType: {
      type: String,
      enum: {
        values: ["GYM", "LIBRARY", "HALL", "ROOM", "SPORTS", "PARKING", "OTHER"],
        message: "Invalid facility type"
      },
      default: "OTHER"
    },

    // Booking Type & Pricing
    bookingType: {
      type: String,
      enum: {
        values: ["FREE", "PAID"],
        message: "Booking type must be FREE or PAID"
      },
      default: "FREE",
      required: [true, "Booking type is required"],
      index: true
    },

    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"]
    },

    // Capacity & Slots
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"]
    },

    slots: [slotSchema],

    // Status & Analytics
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    totalRevenue: {
      type: Number,
      default: 0,
      min: [0, "Revenue cannot be negative"]
    },

    // Additional Details
    amenities: [String]
  },
  { timestamps: true }
);

// Indexes for performance
facilitySchema.index({ isActive: 1, createdAt: -1 });
facilitySchema.index({ bookingType: 1, isActive: 1 });
facilitySchema.index({ name: "text", description: "text" });

export default mongoose.model("Facility", facilitySchema);