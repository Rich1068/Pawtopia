import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import {
  getOrderBySessionId,
  getOrderHistory,
} from "../controllers/orderController";

const order = express.Router();

order.get("/success/:sessionId", getOrderBySessionId);
order.get("/history", tokenAuth, getOrderHistory);

export default order;
