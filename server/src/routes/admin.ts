import express from "express";
import {
  getAdminStats,
  getAdoptionsPerMonth,
  getEarningsPerMonth,
  getLatestPendingRequest,
  getMostSoldProducts,
  getRecentOrders,
} from "../controllers/adminController";
import adminAuth from "../middlewares/adminAuth";

const admin = express.Router();

admin.get("/stats", adminAuth, getAdminStats);
admin.get("/adoptions-per-month", adminAuth, getAdoptionsPerMonth);
admin.get("/pending-requests", adminAuth, getLatestPendingRequest);
admin.get("/earnings-per-month", adminAuth, getEarningsPerMonth);
admin.get("/most-sold-products", adminAuth, getMostSoldProducts);
admin.get("/recent-orders", adminAuth, getRecentOrders);
export default admin;
