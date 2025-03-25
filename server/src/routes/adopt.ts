import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import { createAdoptRequest } from "../controllers/adoptController";

const adopt = express.Router();

adopt.post("/create-request", tokenAuth, createAdoptRequest);

export default adopt;
