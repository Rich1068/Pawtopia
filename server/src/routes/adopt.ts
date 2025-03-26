import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import {
  approveAdoptRequest,
  createAdoptRequest,
  getAdoptRequests,
  rejectAdoptRequest,
} from "../controllers/adoptController";

const adopt = express.Router();

adopt.post("/create-request", tokenAuth, createAdoptRequest);
adopt.get("/requests", tokenAuth, getAdoptRequests);
adopt.put("/:id/approve", tokenAuth, approveAdoptRequest);
adopt.put("/:id/reject", tokenAuth, rejectAdoptRequest);
export default adopt;
