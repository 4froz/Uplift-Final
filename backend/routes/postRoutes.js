import express from "express";
const router = express.Router();
import { createPost,deletePost,getFeedPosts,getPost,getRandomPost,getUserPost,likePost, reactToPost } from "../controllers/postController.js";
import {} from "../middleware/authMiddleware.js";

router.route("/").post(createPost).get(getFeedPosts);
router.route("/user/:id").put(getUserPost);
router.route("/random").get(getRandomPost);
router.route("/:id/like").put(likePost);
router.route("/:id/react").put(reactToPost);
router.route("/:id").get(getPost).delete(deletePost);
router.route("/:id/like").put(likePost);

export default router;
