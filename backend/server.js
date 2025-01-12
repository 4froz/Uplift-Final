import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";
import communityRoutes from "./routes/communityRoute.js";
import userRoute from "./routes/userRoute.js";
import reactionRoute from "./routes/reactionRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import Emmiter from "events";
dotenv.config();

connectDB();

const app = express();
app.use(cors());

app.use(bodyParser.json());

const eventEmmiter = new Emmiter();
app.set("eventEmmiter", eventEmmiter);
app.use("/api/posts", postRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/user", userRoute);
app.use("/api/react", reactionRoute);
app.use("/api/notification", notificationRoute);

app.get("/", (req, res) => {
  res.send("Api is Running");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://meatloo.com",
      "http://localhost:3000",
      "http://192.168.1.207:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId) => {
    console.log(`Client joined room ${roomId}`);
    socket.join(roomId);
  });
});

eventEmmiter.on("addchat", (data) => {
  const { communityId, user, message, image,reply } = data;
  console.log(reply);
  
  // Emit the chat message to the relevant room
  io.to(`${communityId}`).emit("addchat", { user, message, image,reply });

  // Log the chat message
  console.log(`Chat message to ${communityId}:`, { user, message, image });
});

eventEmmiter.on("updateActiveStatus", (data) => {
  const { updatedUser } = data;

  // Emit the chat message to the relevant room
  io.to(`update`).emit("updateActiveStatus", { updatedUser });

  // Log the chat message
  console.log(`Active Satus updated ${updatedUser.active}`,);
});

eventEmmiter.on("posted", (data) => {
  const { post } = data;

  // Emit the chat message to the relevant room
  io.to(`home`).emit("posted", { post });

  // Log the chat message
  console.log(post.desc);
});

httpServer.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
