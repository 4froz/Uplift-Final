import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: Object,  // Reference to a User model
      required: Object
    },
    post: {
      type: Object,  // Reference to a Post model
      required: Object
    },
    type: {
      type: String,  // Type of notification (e.g., "like", "reply", "mention")
      required: true,
      default:"like"
    },
    comment: {
      type: String,  // Optional comment or message for the notification
    },
    userId: {
      type: String, // Reference to the user who triggered the notification
      required: true
    }
  },
  {
    timestamps: true  // Automatically adds createdAt and updatedAt timestamps
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
