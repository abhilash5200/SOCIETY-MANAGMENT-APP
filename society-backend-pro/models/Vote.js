import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll"
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    optionIndex: Number
  },
  { timestamps: true }
);

export default mongoose.model("Vote", voteSchema);