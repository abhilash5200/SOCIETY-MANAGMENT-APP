import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    description: String,

    location: String,

    capacity: Number,

    isPaid: {
      type: Boolean,
      default: false
    },

    price: {
      type: Number,
      default: 0
    },

    maxSlotsPerDay: {
      type: Number,
      default: 8
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Facility", facilitySchema);