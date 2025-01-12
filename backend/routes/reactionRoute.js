import express from "express";
import { deleteReaction, getReaction, reactToPost } from "../controllers/reactionController.js";
const router = express.Router();


router.route("/").post(reactToPost)
router.route("/:id").get(getReaction).delete(deleteReaction);

export default router;
