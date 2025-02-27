import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import {
  verifyUserToken,
  logoutUser,
  getUser,
} from "../controllers/authController";
const auth = express.Router();

auth.post("/verify-token", verifyUserToken);

auth.post("/logout", logoutUser);

auth.get("/get-user", tokenAuth, getUser);
auth;
export default auth;
