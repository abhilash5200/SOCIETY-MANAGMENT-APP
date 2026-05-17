import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["GENERAL", "MAINTENANCE", "EVENT", "EMERGENCY", "POLICY"],
      default: "GENERAL"
    },

    isImportant: {
      type: Boolean,
      default: false
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);