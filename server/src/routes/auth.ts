import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import {
  verifyUserToken,
  logoutUser,
  refreshToken,
} from "../controllers/authController";

const auth = express.Router();

auth.post("/verify-token", verifyUserToken);
auth.post("/logout", logoutUser);
auth.post("/refresh-token", refreshToken);
export default auth;
