import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import {
  getAllOrders,
  getOrderBySessionId,
  getOrderHistory,
} from "../controllers/orderController";
import adminAuth from "../middlewares/adminAuth";

const order = express.Router();

order.get("/success/:sessionId", getOrderBySessionId);
order.get("/history", tokenAuth, getOrderHistory);
order.get("/all", adminAuth, getAllOrders);

export default order;
