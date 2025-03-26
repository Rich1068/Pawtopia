import { Request, Response } from "express";
import Chat from "../models/Chat";

export const startChat = async (req: Request, res: Response) => {
  try {
    const { adoptionId } = req.body;

    if (!adoptionId) {
      res.status(400).json({ error: "Adoption ID is required" });
      return;
    }

    res.status(200).json({ chatId: adoptionId });
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { adoptionId } = req.params;
    const messages = await Chat.find({ adoptionId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const saveMessage = async (req: Request, res: Response) => {
  try {
    const { adoptionId, sender, message } = req.body;
    console.log(req.body);
    if (!adoptionId || !sender || !message) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const newMessage = new Chat({
      adoptionId,
      sender,
      message,
    });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
