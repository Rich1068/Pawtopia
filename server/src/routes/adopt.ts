import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import {
  approveAdoptRequest,
  rejectAdoptRequest,
  createAdoptRequest,
  getAdoptRequests,
} from "../controllers/adoptController";
import adminAuth from "../middlewares/adminAuth";

const adopt = express.Router();

adopt.post("/create-request", tokenAuth, createAdoptRequest);
adopt.get("/requests", adminAuth, getAdoptRequests);
adopt.put("/:id/approve", adminAuth, approveAdoptRequest);
adopt.put("/:id/reject", adminAuth, rejectAdoptRequest);
export default adopt;
