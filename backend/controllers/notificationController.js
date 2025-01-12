import Notification from "../models/notificationModel.js";
import Reaction from "../models/reactionsModal.js";

export const createNotification = async (req, res) => {
  try {
    const { notification_ } = req.body;
    console.log(notification_);
    const notification = new Notification({
     user:notification_.user,
     post:notification_.post,
     type:notification_.type,
     comment:notification_.comment,
     userId:notification_.userId
    });
    const createdNotification = await notification.save();
    // const eventEmmiter = req.app.get("eventEmmiter");
    // eventEmmiter.emit("reacted", { reaction: createdNotification });
    res.status(201).json(createdNotification);
  } catch (error) {
    res.status(404)
    console.log(error);
  }
}

export const getNotifications = async (req, res) => {
  console.log(req.params.id);
  const notification = await Notification.find({ userId:req.params.id }).sort({ createdAt: -1 });;
  if (notification) {
    res.json(notification);
  } else {
    res.status(404).json({ mssg: "Notification Not Found" });
  }
}
