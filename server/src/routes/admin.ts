import express from "express";
import {
  getAdminStats,
  getAdoptionsPerMonth,
  getLatestPendingRequest,
} from "../controllers/adminController";
import tokenAuth from "../middlewares/tokenAuth";

const admin = express.Router();

admin.get("/stats", tokenAuth, getAdminStats);
admin.get("/adoptions-per-month", tokenAuth, getAdoptionsPerMonth);
admin.get("/pending-requests", tokenAuth, getLatestPendingRequest);
export default admin;
