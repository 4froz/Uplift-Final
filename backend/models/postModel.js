import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
      ref: "User",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    profilePic: {
      type: String,
    },
    image: {
      type: String,
      required: false,
    },
    mood: {
      type: String,
      required: false,
    },
    likes: [],
    desc: {
      type: String,
      required: true,
    },
    reactions:[]
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Posts", postSchema);

export default Post;
