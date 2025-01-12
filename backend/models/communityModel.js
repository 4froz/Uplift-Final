import mongoose from "mongoose";

const communitySchema = mongoose.Schema(
  {
    from:{
      type:String,
      required:true
    },
    to:{
      type:String,
      required:true
    },
    chats: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Community = mongoose.model("Community", communitySchema);

export default Community;
