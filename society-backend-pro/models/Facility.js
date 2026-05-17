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

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Facility", facilitySchema);