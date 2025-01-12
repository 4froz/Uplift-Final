import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import Reaction from "../models/reactionsModal.js";
import User from "../models/userModal.js";

export const reactToPost = async (req, res) => {
  try {
    const notifications = await Notification.find();
    const { reaction_ } = req.body;
    const post = await Post.findById(reaction_.postId);
    const reaction = new Reaction({
      postId: reaction_.postId,
      profilePic: reaction_.profilePic,
      std: reaction_.std,
      id: reaction_.id,
      reaction: reaction_.reaction,
      randomId: reaction_.randomId,
    });
    const createdReaction = await reaction.save();
    const existsNot = notifications.some(
      (notification) =>
        notification.reaction == reaction_.reaction &&
        notification.postId == post._id
    );
    console.log(existsNot);
    
    if (!existsNot) {
      const notification = new Notification({
        userId: post.userId,
        profilePic: reaction_.profilePic,
        liked: false,
        replied: false,
        id: reaction_.id,
        postId: post._id,
        postImage: post.image,
        reaction: reaction_.reaction,
      });
      const createdNotification = await notification.save();
    }

    if (reaction_.reaction.match(/@\w+/g)) {
      const mentionsWithAt = reaction_.reaction.match(/@\w+/g);
      const mentionsWithoutAt = mentionsWithAt.map((mention) =>
        mention.slice(1)
      );
      const user = await User.findOne({ id: mentionsWithoutAt });
      const notification = new Notification({
        userId: user._id,
        profilePic: reaction_.profilePic,
        liked: false,
        replied: true,
        id: reaction_.id,
        postId: post._id,
        postImage: post.image,
        reaction: reaction_.reaction,
      });
      const createdNotification = await notification.save();
    }
    // console.log(createdNotification);
    // const eventEmmiter = req.app.get("eventEmmiter");
    // eventEmmiter.emit("reacted", { reaction: createdReaction });
    res.status(201).json(createdReaction);
  } catch (error) {
    res.status(404);
    console.log(error);
  }
};

export const getReaction = async (req, res) => {
  console.log(req.params.id);
  const reaction = await Reaction.find({ postId: req.params.id });
  if (reaction) {
    res.json(reaction);
  } else {
    res.status(404).json({ mssg: "reaction Not Found" });
  }
};

export const deleteReaction = async (req, res) => {
  console.log(req.params.id);
  const reaction = await Reaction.findById(req.params.id);
  const post = await Post.findById(reaction.postId);
  const objWithIdIndex = post.likes.findIndex(
    (_reaction) => _reaction.reaction == reaction.reaction
  );
  if (reaction) {
    await reaction.remove();
    post.reactions.splice(objWithIdIndex, 1);
    const updatedpost = await post.save();
    const eventEmmiter = req.app.get("eventEmmiter");
    eventEmmiter.emit("reacted", { post, reaction, deleted: true });
  } else {
    res.status(404);
    
  }
};
