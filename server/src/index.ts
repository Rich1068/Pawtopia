import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./routes/routes";
import dotenv from "dotenv";
import db_connection from "./db-config";
import auth from "./routes/auth";
import pet from "./routes/pets";
import user from "./routes/user";
import path from "path";
import email from "./routes/email";
import product from "./routes/product";
import cart from "./routes/cart";
import bodyParser from "body-parser";
import { handleCheckoutSuccess } from "./controllers/cartController";
import order from "./routes/order";
import adopt from "./routes/adopt";
import http from "http";
import { Server } from "socket.io";
import chat from "./routes/chat";
import Chat from "./models/Chat";
import AdoptRequest from "./models/AdoptRequest";

db_connection();
dotenv.config();
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL!,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: [process.env.CLIENT_URL!, "https://checkout.stripe.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleCheckoutSuccess
);
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/", route);
app.use("/api", auth);
app.use("/pet", pet);
app.use("/user", user);
app.use("/email", email);
app.use("/product", product);
app.use("/cart", cart);
app.use("/order", order);
app.use("/adopt", adopt);
app.use("/chat", chat);

const userSockets = new Map(); // Store userId -> socketId mapping

io.on("connection", (socket) => {
  console.log(`🔗 User connected: ${socket.id}`);

  socket.on("registerUser", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`✅ Registered user: ${userId} -> ${socket.id}`);
  });

  socket.on("sendMessage", async (data) => {
    const { adoptionId, sender, message } = data;

    const newMessage = new Chat({ adoptionId, sender, message });
    await newMessage.save();

    io.to(adoptionId).emit("receiveMessage", newMessage);

    // Check if recipient is online and notify them
    const adoptionRequest = await AdoptRequest.findById(adoptionId).populate(
      "userId",
      "_id"
    );

    if (adoptionRequest) {
      const adopterId = adoptionRequest.userId._id.toString();
      const adopterSocket = userSockets.get(adopterId);

      if (adopterSocket) {
        io.to(adopterSocket).emit("newUnreadChat", { adoptionId });
      }
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`🔴 User disconnected: ${userId}`);
        break;
      }
    }
  });
});
const port = process.env.PORT || 10000;
server.listen(port, () => {
  console.log("Backend Server running at Port: " + port);
});
