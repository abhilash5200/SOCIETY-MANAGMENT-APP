import mongoose from "mongoose";

const flatSchema = new mongoose.Schema(
  {
    block: {
      type: String,
      required: true
    },

    flatNumber: {
      type: String,
      required: true
    },

    floor: {
      type: Number,
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    residents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    isOccupied: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Flat", flatSchema);