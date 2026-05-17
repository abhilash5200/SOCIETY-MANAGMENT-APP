import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    dueDate: {
      type: Date,
      required: true
    },

    paid: {
      type: Boolean,
      default: false
    },

    paymentMethod: {
      type: String,
      enum: ["ONLINE", "CASH", "UPI"],
      default: null
    },

    paymentDate: Date,

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema);