import express from "express";
import {
  startChat,
  getChatMessages,
  saveMessage,
} from "../controllers/chatController";

const chat = express.Router();

chat.post("/start", startChat);
chat.get("/:adoptionId", getChatMessages);
chat.post("/send", saveMessage);

export default chat;
