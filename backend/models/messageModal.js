import mongoose from "mongoose";
const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    reply: {
        type:String
    },
  },
  {
    timestamps: true,
  }
);

const Messages = mongoose.model("Messages", MessageSchema);
export default Messages;
