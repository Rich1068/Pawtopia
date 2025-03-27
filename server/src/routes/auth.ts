import express from "express";
import {
  verifyUserToken,
  logoutUser,
  refreshToken,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
} from "../controllers/authController";
import {
  resendVerificationEmail,
  verifyEmail,
} from "../controllers/emailController";

const auth = express.Router();

auth.post("/verify-token", verifyUserToken);
auth.post("/logout", logoutUser);
auth.post("/refresh-token", refreshToken);
auth.post("/forgot-password", requestPasswordReset);
auth.get("/reset-password/:token", verifyResetToken);
auth.post("/reset-password/:token", resetPassword);
auth.get("/auth/verify-email", verifyEmail);
auth.post("/auth/resend-verification", resendVerificationEmail);
export default auth;
