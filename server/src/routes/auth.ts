import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import { verifyUserToken, logoutUser } from "../controllers/authController";
const auth = express.Router();

auth.post("/verify-token", verifyUserToken);

auth.post("/logout", logoutUser);

export default auth;
