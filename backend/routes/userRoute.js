import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  addRemoveFollowing,
  getUserFollower,
  login,
  register,
  getUser,
  getUsers,
  getUserProfile,
  updateUserProfile,
  addRemoveFriend,
  getUserById,
  authUser,
  updateBio,
  updateProfilePic,
  updateMood,
  giveRequest,
  getUserRequest,
  deleteRequest,
  acceptRequest,
  getUserFriends,
  deletefriend,
  checkUsernameAvailability,
  updateAciveStatus,
  searchUsernames,
  updateGoal,
  updateName,
  updateUsername,
} from "../controllers/userController.js";

const router = express.Router();

/* READ */
router.get("/id/:id", getUserById);
router.get("/", getUsers);
router.post("/checkUsername", checkUsernameAvailability);
router.post("/search", searchUsernames);
router.post("/", authUser);
router.put("/bio/:id", updateBio);
router.put("/profilePic/:id", updateProfilePic);
router.put("/mood/:id", updateMood);
router.put("/goal/:id", updateGoal);
router.put("/name/:id", updateName);
router.put("/username/:id", updateUsername);
// router.get("/:id/followers", getUserFollower);

/* UPDATE */
router.patch("/:id", addRemoveFriend);
// router.put("/:id",  updateUserRequest);
router.get("/:id", getUserProfile);
router.patch("/:id/update", updateUserProfile);
router.post("/login", login);
router.post("/register", register);

//requests
router.put("/request/:id", giveRequest);
router.get("/request/:id", getUserRequest);
router.post("/request/:id", deleteRequest);

router.post("/accept/:id", acceptRequest);
router.get("/friends/:id", getUserFriends);
router.post("/friends/:id", deletefriend);

router.put("/activeStatus/:id", updateAciveStatus);

export default router;
