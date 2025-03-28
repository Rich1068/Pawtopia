import express from "express";
import {
  getAdminStats,
  getAdoptionsPerMonth,
  getEarningsPerMonth,
  getLatestPendingRequest,
  getMostSoldProducts,
  getRecentOrders,
} from "../controllers/adminController";
import tokenAuth from "../middlewares/tokenAuth";

const admin = express.Router();

admin.get("/stats", tokenAuth, getAdminStats);
admin.get("/adoptions-per-month", tokenAuth, getAdoptionsPerMonth);
admin.get("/pending-requests", tokenAuth, getLatestPendingRequest);
admin.get("/earnings-per-month", tokenAuth, getEarningsPerMonth);
admin.get("/most-sold-products", tokenAuth, getMostSoldProducts);
admin.get("/recent-orders", tokenAuth, getRecentOrders);
export default admin;
