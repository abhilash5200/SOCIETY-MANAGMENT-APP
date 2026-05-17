import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["CAR", "BIKE"],
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);