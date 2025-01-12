import express from "express";
import {
  createChat,
  createCommunity,
  getCommunity,
  getMainCommunity,
} from "../controllers/communityController.js";
const router = express.Router();

router.route("/").post(createCommunity);
router.route("/main/:id").get(getMainCommunity);
router.route("/:id").post(createChat);
router.route("/").put(getCommunity);

export default router;
