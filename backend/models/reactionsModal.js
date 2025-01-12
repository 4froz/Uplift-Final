import mongoose from "mongoose";

const reactionSchema = mongoose.Schema(
  {
    reaction: {
      type: String,
    },
    id: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    std: {
      type: String,
    },
    randomId: {
      type: String,
    },
    postId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Reaction = mongoose.model("Reactions", reactionSchema);

export default Reaction;
