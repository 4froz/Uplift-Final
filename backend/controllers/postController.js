import asyncHandler from "express-async-handler";
import Post from "../models/postModel.js";
import User from "../models/userModal.js";
import Notification from "../models/notificationModel.js";
import mongoose from "mongoose";
import { sendNotification } from "../not.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { desc, user, image } = req.body;
  try {
    const post = new Post({
      name: user.name,
      profilePic: user.profilePic,
      desc,
      userId: user._id,
      mood: user.mood,
      image: image,
      username: user.username,
    });
    const eventEmmiter = req.app.get("eventEmmiter");
    const createdPost = await post.save();
    eventEmmiter.emit("posted", {
      post: createdPost,
    });

    res.status(201).json(createPost);
  } catch (error) {
    console.log(error);
  }
});
// export const getFeedPosts = async (req, res) => {
//   try {
//     // Extract query parameters
//     const { start = 0, limit = 10 } = req.query;

//     // Convert start and limit to integers
//     const startIndex = parseInt(start, 10);
//     const limitNumber = parseInt(limit, 10);

//     // Fetch paginated posts
//     const posts = await Post.find()
//       .sort({ createdAt: -1 }) // Optional: sort posts by creation date
//       .skip(startIndex) // Skip the number of items specified by start
//       .limit(limitNumber); // Limit the number of items fetched

//     res.status(200).json({
//       posts,
//     });
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Sort by creation date (descending)

    res.status(200).json({
      posts,
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getUserPost = asyncHandler(async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.params.id); // Convert to ObjectId
    const post = await Post.find({ userId: userId }).lean(); // Convert the result to plain JS object
    if (post.length > 0) {
      res.json({ post });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export const getRandomPost = async (req, res) => {
  try {
    const randomPost = await Post.aggregate([{ $sample: { size: 1 } }]);
    res.status(200).json(randomPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Something went wraang" });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    await post.remove();
    eventEmmiter.emit("posted", {
      post: post,
      delete: true,
    });
  } else {
    res.status(404);
  }
});

const likePost = asyncHandler(async (req, res) => {
  const { like, user } = req.body;
  const post = await Post.findById(req.params.id);
  
  const formatUser = {
    name: user.name,
    profilePic: user.profilePic,
    _id: user._id,
  };

  if (post) {
    const formatPost = {
      image: post.image,
      desc: post.desc,
      _id: post._id,
    };

    try {
      const isLiked = post.likes.find((x) => x.like == like);

      if (isLiked) {
        const objWithIdIndex = post.likes.findIndex((obj) => obj.like == like);
        post.likes.splice(objWithIdIndex, 1);

        const eventEmmiter = req.app.get("eventEmmiter");
        eventEmmiter.emit("liked", { like, islike: false, post });

        const updatedpost = await post.save();
        res.json(updatedpost);
      } else {
        post.likes.push(req.body);

        const eventEmmiter = req.app.get("eventEmmiter");
        eventEmmiter.emit("liked", { like, islike: true, post });

        const updatedpost = await post.save();
        res.json(updatedpost);

        // Check if the user liking the post is the post author
        if (user._id !== post.userId.toString()) {
          const notificationData = {
            user: formatUser, // This should be an object containing the user details
            post: formatPost, // This should be an object containing the post details
            type: "like", // Type of notification
            userId: post.userId, // The user ID of the post's author
          };

          try {
            // Check if a notification with the same user._id, post._id, type, and userId exists
            const exists = await Notification.exists({
              "user._id": notificationData.user._id, // Check the _id within the user object
              "post._id": notificationData.post._id, // Check the _id within the post object
              type: notificationData.type, // Check the type of notification
              userId: notificationData.userId, // Check the userId
            });

            if (!exists) {
              // If no existing notification, create a new one
              const notification = new Notification(notificationData);
              await notification.save();
              console.log("Notification saved successfully");

              sendNotification(
                "UpLift",
                `${user.name} liked your post`,
                `${user._id}`,
                `user_${post.userId}`,
                "notification",
                "",
                ""
              );
            } else {
              console.log("Notification already exists");
            }
          } catch (error) {
            console.error(
              "Error checking or saving notification:",
              error.message
            );
          }
        } else {
          console.log("User liked their own post, no notification created");
        }
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(404);
  }
});

const reactToPost = asyncHandler(async (req, res) => {
  const { reaction } = req.body;
  console.log(reaction);
  const post = await Post.findById(req.params.id);

  const formatUser = {
    name: reaction.user.name,
    profilePic: reaction.user.profilePic,
    _id: reaction.user._id,
  };

  if (post) {
    const formatPost = {
      image: post.image,
      desc: post.desc,
      _id: post._id,
    };

    // Add reaction to post
    post.reactions.push(reaction);
    
    // Emit event
    const eventEmmiter = req.app.get("eventEmmiter");
    eventEmmiter.emit("reacted", { post, reaction });

    // Save updated post
    const updatedpost = await post.save();
    res.json(updatedpost);

    // Check if the user reacting to the post is the post author
    if (reaction.user._id !== post.userId.toString()) {
      // Create notification only if the user is not the post author
      const notification = new Notification({
        user: formatUser,
        post: formatPost,
        type: "comment",
        userId: post.userId,
        comment: reaction.reaction,
      });

      await notification.save();
      sendNotification(
        "UpLift",
        `${formatUser.name} reacted to your post "${reaction.reaction}"`,
        `${reaction.user._id}`,
        `user_${post.userId}`,
        "notification",
        "",
        ""
      );
    } else {
      console.log("User reacted to their own post, no notification created");
    }
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

export { createPost, likePost, deletePost, reactToPost };
