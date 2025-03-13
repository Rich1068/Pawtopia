import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import {
  verifyUserToken,
  logoutUser,
  refreshToken,
  requestPasswordReset,
} from "../controllers/authController";

const auth = express.Router();

auth.post("/verify-token", verifyUserToken);
auth.post("/logout", logoutUser);
auth.post("/refresh-token", refreshToken);
auth.post("/forgot-password", requestPasswordReset);
auth.post("/verify-reset-code");
auth.post("/resend-reset-code");
export default auth;
