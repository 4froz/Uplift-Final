import express from "express";
import { createNotification, getNotifications } from "../controllers/notificationController.js";
const router = express.Router();


router.route("/").post(createNotification)
router.route("/:id").get(getNotifications);

export default router;
