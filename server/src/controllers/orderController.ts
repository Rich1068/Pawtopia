import { Response, Request } from "express";
import dotenv from "dotenv";
import Order from "../models/Order";
import { AuthRequest } from "../Types/Types";

dotenv.config();

export const getOrderBySessionId = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const order = await Order.findOne({ orderId: sessionId });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const getOrderHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(403).json({ error: "Please Login to see Order History" });
      return;
    }
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to retrieve Order History" });
  }
};
