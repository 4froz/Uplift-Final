import User from "../models/userModal.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../middleware/generateToken.js";
import mongoose from "mongoose";
import { sendNotification } from "../not.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js";
/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const { email, password, name, profilePic } = req.body;
    console.log("porfilepicc " + profilePic);
    const user = await User.findOne({ email });
    const userEmail = await User.findOne({ email: email });
    if (userEmail) res.json({ error: "Email Already Exist" });
    if (!user) {
      const user = await User.create({
        email,
        password,
        name,
        profilePic,
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          profilePic: user.profilePic,
          token: generateToken(user._id),
        });
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email } = req.body;

    // Log the incoming email
    console.log(`Email received: ${email}`);

    // Find the user by email
    const user = await User.findOne({ email });

    // Log the user object or null if not found
    console.log(`User found: ${JSON.stringify(user)}`);

    if (!user) {
      return res.status(400).json({ message: "User not found" }); // Use a structured response
    }

    // If the user is found, return user details without checking the password
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      mood: user.mood,
      username: user.username,
      goal: user.goal,
      goalCategory: user.goalCategory,
    });
  } catch (error) {
    console.error("Error during login:", error); // Log the full error
    return res.status(500).json({ message: "Server error" }); // Use a structured response
  }
};

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find({}).select(
    "name _id profilePic bio username active goalCategory"
  );
  res.json(users);
};

export const getUserFollower = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const followers = await Promise.all(
      user.followers.map((id) => User.findById(id))
    );
    const formattedfollowers = followers.map(({ _id, id, std, profilePic }) => {
      return { _id, std, id, profilePic };
    });
    res.status(200).json(formattedfollowers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    const { followUser } = req.body;
    const user = await User.findById(id);
    const follower = await User.findById(followUser._id);
    const existUser = follower?.followings?.find(
      (follow) => follow.id == user.id
    );

    if (
      user.followers.find((user) => user._id == followUser._id) &&
      existUser != null
    ) {
      user.followers = user.followers.filter(
        (user) => user._id !== followUser._id
      );
      follower.followings = follower.followings.filter(
        (follow) => follow._id !== user._id
      );
      const eventEmmiter = req.app.get("eventEmmiter");
      eventEmmiter.emit("followerAdded", { followUser, user, follow: false });
    } else {
      user.followers.push(followUser);
      follower.followings.push(user);

      const eventEmmiter = req.app.get("eventEmmiter");
      eventEmmiter.emit("followerAdded", { followUser, user, follow: true });
    }
    await user.save();
    await follower.save();

    const followers = await Promise.all(
      user.followers.map((id) => User.findById(id))
    );
    const formattedfollowers = followers.map(({ _id, id, std, profilePic }) => {
      return { _id, std, id, profilePic };
    });

    res.status(200).json(formattedfollowers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const { followUser } = req.body;
    const user = await User.findById(id);
    const friend = await User.findById(followUser._id);

    if (user.friends.find((user) => user._id == followUser._id)) {
      user.friends = user.friends.filter((user) => user._id !== followUser._id);

      friend.friends = user.friends.filter(
        (user) => user._id !== followUser._id
      );

      const eventEmmiter = req.app.get("eventEmmiter");
      eventEmmiter.emit("followerAdded", { followUser, user, follow: false });
    } else {
      user.friends.push(followUser);
      friend.friends.push(user);
      const eventEmmiter = req.app.get("eventEmmiter");
      eventEmmiter.emit("followerAdded", { followUser, user, follow: true });
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      bio: user.bio,
      gender: user.gender,
      age: user.age,
      profilePic: user.profilePic,
      friends: user.friends,
      requests: user.requests,
      mood: user.mood,
      username: user.username,
      goal: user.goal,
      active: user.active,
    });
  } else {
    res.status(404).json("");
    console.log("User not found");
  }
};

export const getUserById = async (req, res) => {
  const user = await User.findOne({ id: req.params.id });

  if (user) {
    res.json({
      user,
    });
  } else {
    res.status(404).json({ mssg: "User Not Found" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id }, // Assuming your route includes the user ID as a parameter
      {
        $set: {
          profilePic: req.body.profilePic,
        },
      },
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

export const updateBio = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id }, // Assuming your route includes the user ID as a parameter
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    // Update user profile picture
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id }, // Assuming your route includes the user ID as a parameter
      {
        $set: {
          profilePic: req.body.profilePic,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 3: Update posts associated with the user
    await Post.updateMany(
      { userId: req.params.id }, // Find all posts by this user
      {
        $set: {
          profilePic: req.body.profilePic, // Update profilePic in the post model
        },
      }
    );

    // Step 4: Update reactions in the posts
    await Post.updateMany(
      { "reactions.user._id": req.params.id }, // Find posts where the user's ID is in reactions
      {
        $set: { "reactions.$[elem].user.profilePic": req.body.profilePic }, // Update the profilePic in reactions
      },
      {
        arrayFilters: [{ "elem.user._id": req.params.id }], // Filter to only update the correct user's reactions
      }
    );

    await Notification.updateMany(
      { "user._id": req.params.id }, // Find notifications where user._id matches
      {
        $set: {
          "user.profilePic": req.body.profilePic, // Correct path to update the user's name
        },
      }
    );

    // Respond with the updated user
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateMood = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id }, // Assuming your route includes the user ID as a parameter
      {
        $set: {
          mood: req.body.mood,
        },
      },
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};
export const updateName = async (req, res) => {
  try {
    // Step 1: Update user name and username
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id }, // Assuming your route includes the user ID as a parameter
      {
        $set: {
          name: req.body.name,
          username: req.body.username,
        },
      },
      { new: true, runValidators: true }
    );

    // Step 2: Check if the user was found and updated

    // Step 3: Update posts associated with the user
    if (updatedUser) {
      // Step 3: Update posts associated with the user
      await Post.updateMany(
        { userId: req.params.id }, // Find all posts by this user
        {
          $set: {
            name: req.body.name, // Directly update the name in the post model
            username: req.body.username, // Also update the username if needed
          },
        }
      );

      // Step 4: Update reactions in the posts
      await Post.updateMany(
        { "reactions.user._id": req.params.id }, // Find posts where the user's ID is in reactions
        {
          $set: { "reactions.$[elem].user.name": req.body.name }, // Update the name in reactions
        },
        {
          arrayFilters: [{ "elem.user._id": req.params.id }], // Filter to only update the correct user's reactions
        }
      );

      await Notification.updateMany(
        { "user._id": req.params.id }, // Find notifications where user._id matches
        {
          $set: {
            "user.name": req.body.name, // Correct path to update the user's name
            "user.username": req.body.username, // Correct path to update the username
          },
        }
      );

      // Respond with the updated user
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error(error);
  }
};

export const updateUsername = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id }, // Assuming your route includes the user ID as a parameter
      {
        $set: {
          username: req.body.username,
        },
      },
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

export const updateGoal = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id }, // Assuming your route includes the user ID as a parameter
      {
        $set: {
          goal: req.body.goal,
          goalCategory: req.body.goalCategory,
        },
      },
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

export const authUser = async (req, res) => {
  const { email, password, name, username, goal, goalCategory } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    console.log("User Not Found");
    if (username) {
      const user = await User.create({
        email,
        password,
        name,
        username,
        goal,
        goalCategory,
      });
      user.save();
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        mood: user.mood,
        goal: user.goal,
        goalCategory: user.goalCategory,
      });
    } else {
      return res.status(400).json("user not found");
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        mood: user.mood,
        goal: user.goal,
        goalCategory: user.goalCategory,
      });
    }
  } else {
    const data = await User.findOne({ email });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      mood: user.mood,
      username: user.username,
      goal: user.goal,
      goalCategory: user.goalCategory,
    });
  }
};

export const giveRequest = async (req, res) => {
  const { requestUser } = req.body; // The user you want to add to the requests
  const user = await User.findById(req.params.id); // Find the user by ID
  console.log(requestUser._id);

  if (user) {
    try {
      // Initialize the requests array if it does not exist
      if (!user.requests) {
        user.requests = [];
      }

      // Check if requestUser already exists in the user.requests array
      const userExists = user.requests.some(
        (reqUser) => reqUser._id.toString() === requestUser._id.toString()
      );

      if (!userExists) {
        user.requests.push(requestUser); // Add the new request if it doesn't exist
        sendNotification(
          `${requestUser.name}`,
          `sent u a friend request`,
          "request",
          `user_${user._id}`,"notification","",""
        );
        await user.save(); // Save the changes to the user document
        return res.status(200).json({ message: "Request added successfully" });
      } else {
        return res
          .status(400)
          .json({ message: "User already exists in the requests" });
      }
    } catch (error) {
      console.error("Error adding request:", error.message);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

export const getUserRequest = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json({
      requests: user.requests,
    });
  } else {
    res.status(404).json("");
  }
};

export const deleteRequest = async (req, res) => {
  const { requestUserId } = req.body;
  console.log(requestUserId);
  // The ID of the user request to delete
  const user = await User.findById(req.params.id); // Find the user by ID

  if (user) {
    try {
      // Check if user.requests is initialized
      if (!user.requests) {
        return res.status(404).json({ message: "No requests found" });
      }

      // Filter out the requestUser from the requests array
      user.requests = user.requests.filter(
        (request) => request._id.toString() !== requestUserId.toString()
      );

      await user.save(); // Save the changes to the user document
      return res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
      console.error("Error deleting request:", error.message);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

export const acceptRequest = async (req, res) => {
  const { acceptUser } = req.body; // This is the user ID to be added
  const user = await User.findById(req.params.id); // Find the user by ID
  const followUser = await User.findById(acceptUser); // Find the user by ID

  if (user && followUser) {
    try {
      // Initialize the friends array if it does not exist
      user.friends = user.friends || [];
      followUser.friends = followUser.friends || [];

      // Check if acceptUser already exists in the user.friends array
      const userExists = user.friends.some(
        (reqUser) => reqUser._id.toString() === acceptUser.toString()
      );

      if (!userExists) {
        user.friends.push({
          username: followUser.username,
          name: followUser.name,
          _id: followUser._id,
          profilePic: followUser.profilePic,
        });

        followUser.friends.push({
          username: user.username,
          name: user.name,
          _id: user._id,
          profilePic: user.profilePic,
        });

        // Remove the request from the user's requests list before saving
        user.requests = user.requests.filter(
          (request) => request._id.toString() !== acceptUser.toString()
        );

        await user.save(); // Save the changes to the user document
        await followUser.save(); // Save the changes to the followUser document

        return res.status(200).json({ message: "Request added successfully" });
      } else {
        return res
          .status(400)
          .json({ message: "User already exists in the friends" });
      }
    } catch (error) {
      console.error("Error adding request:", error.message);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

export const getUserFriends = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json({
      friends: user.friends,
    });
  } else {
    res.status(404).json("");
  }
};

export const deletefriend = async (req, res) => {
  const { friendId } = req.body;
  console.log(friendId);
  // The ID of the user request to delete
  const user = await User.findById(req.params.id); // Find the user by ID
  const friendUser = await User.findById(friendId);

  if (user && friendUser) {
    try {
      // Check if user.requests is initialized
      if (!user.friends) {
        return res.status(404).json({ message: "No friends found" });
      }

      // Filter out the requestUser from the friends array
      user.friends = user.friends.filter(
        (request) => request._id.toString() !== friendId.toString()
      );
      friendUser.friends = friendUser.friends.filter(
        (request) => request._id.toString() !== user._id.toString()
      );

      await user.save(); // Save the changes to the user document
      await friendUser.save(); // Save the changes to the user document
      return res.status(200).json({ message: "friends deleted successfully" });
    } catch (error) {
      console.error("Error deleting request:", error.message);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

export const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.body;
    console.log(username);

    const user = await User.findOne({ username });

    // Return JSON response with `isAvailable` field
    return res.status(200).json({ isAvailable: !user }); // true if available, false if taken
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchUsernames = async (req, res) => {
  try {
    const { query } = req.body;

    // Ensure there's a query string to search for
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Case-insensitive partial search for usernames starting with or containing the query
    const users = await User.find({
      username: { $regex: query, $options: "i" }, // 'i' makes it case-insensitive
    });

    // Map results to return only usernames
    const searchResults = users.map((user) => ({
      username: user.username,
      name: user.name,
      profilePic: user.profilePic,
      _id: user._id,
    }));

    return res.status(200).json({ searchResults });
  } catch (error) {
    console.error("Error searching for usernames:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAciveStatus = async (req, res) => {
  const { active } = req.body;
  const { id } = req.params;
  console.log(req.body);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const eventEmmiter = req.app.get("eventEmmiter");
    // Emit the "addchat" event to notify clients
    // Note: The community ID is used to specify the room
    eventEmmiter.emit("updateActiveStatus", { updatedUser });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating online status", error });
  }
};
