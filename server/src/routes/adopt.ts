import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import {
  createAdoptRequest,
  getAdoptRequests,
} from "../controllers/adoptController";

const adopt = express.Router();

adopt.post("/create-request", tokenAuth, createAdoptRequest);
adopt.get("/requests", tokenAuth, getAdoptRequests);

export default adopt;
