import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema(
  {
    slotNumber: {
      type: String,
      required: true,
      unique: true
    },

    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      default: null
    },

    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null
    },

    type: {
      type: String,
      enum: ["RESIDENT", "GUEST"],
      default: "RESIDENT"
    },

    isOccupied: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Parking", parkingSchema);