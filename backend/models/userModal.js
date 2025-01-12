import mongoose from "mongoose";
import Post from "./postModel.js";
import Reaction from "./reactionsModal.js";
import Notification from "./notificationModel.js";
import { request } from "express";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      unique: true,
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    profilePic: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      required:true
    },
    goal: {
      type: String,
      default: "",
    },
    goalCategory: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
    friends: {
      type: Array,
    },
    mood: {
      type: String,
      default: "",
    },
    requests: {
      type: Array,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
