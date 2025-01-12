import Messages from "../models/messageModal";

const createChat = asyncHandler(async (req, res) => {
  const { from, to, message } = req.body;

  if (!from || !to || !message) {
    return res.status(400).json({ message: "User and message are required" });
  }

  try {
    const user = await Messages.create({
      from,
      to,
      message,
    });
    const eventEmmiter = req.app.get("eventEmmiter");
    // Emit the "addchat" event to notify clients
    // Note: The community ID is used to specify the room
    // eventEmmiter.emit("addchat", { communityId, user, message, image });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
});
