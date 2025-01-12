import asyncHandler from "express-async-handler";
import Community from "../models/communityModel.js";
import { sendNotification } from "../not.js";

const createCommunity = asyncHandler(async (req, res) => {
  const { from, to } = req.body;

  try {
    const community = new Community({
      from: from,
      to: to,
    });
    const eventEmmiter = req.app.get("eventEmmiter");
    const createdcommunity = await community.save();
    console.log(createdcommunity);
    eventEmmiter.emit("communityed", {
      community: createdcommunity,
    });

    res.status(201).json(createdcommunity);
  } catch (error) {
    console.log(error);
  }
});

const getMainCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (community) {
      // Get the last 10 messages from the chats array
      const chats = community.chats.slice(-50);

      res.status(200).json({
        _id: community._id,
        chats: chats,
      });
    } else {
      res.status(404).json({ message: "Something went wrong" });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const createChat = asyncHandler(async (req, res) => {
  const { user, message, date, reply, from, to } = req.body;
  const communityId = req.params.id;

  // Validate input
  if (!user || !message) {
    return res.status(400).json({ message: "User and message are required" });
  }

  try {
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Add the new chat to the community's chats array
    community.chats.push({ user, message, date, reply });

    // Save the updated community document
    const updatedCommunity = await community.save();
    sendNotification(
      `${user.name}`,
      `${message}`,
      `${user._id}`,
      `user_${to}`,
      "message",
      community._id,
      JSON.stringify(user.name),
      JSON.stringify(user._id),
    );
    console.log(to);

    // Send the updated community back as a response
    res.json(updatedCommunity);
    const eventEmmiter = req.app.get("eventEmmiter");
    // Emit the "addchat" event to notify clients
    // Note: The community ID is used to specify the room
    eventEmmiter.emit("addchat", { communityId, user, message, reply });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
});

export const getUserCommunity = async (req, res) => {
  const community = await Community.findById(req.params.id);
  if (community) {
    res.json({
      _id: community._id,
      name: community.name,
      bio: community.bio,
      gender: community.gender,
      age: community.age,
      profilePic: community.profilePic,
      friends: community.friends,
      requests: community.requests,
      mood: community.mood,
    });
  } else {
    res.json("No chats");
  }
};

const getCommunity = async (req, res) => {
  try {
    const communities = await Community.find({
      $or: [{ from: req.body.id }, { to: req.body.id }],
    }).select("_id from to chats"); // Select only the _id and chats fields

    // Map through the communities and only return _id and the last chat from chats array
    const communitiesWithLastChat = communities.map((community) => ({
      _id: community._id,
      from: community.from,
      to: community.to,
      lastChat:
        community.chats.length > 0
          ? community.chats[community.chats.length - 1]
          : null,
    }));

    if (communitiesWithLastChat.length > 0) {
      res.status(200).json(communitiesWithLastChat);
    } else {
      res.status(200).json([]);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createCommunity, createChat, getMainCommunity, getCommunity };
