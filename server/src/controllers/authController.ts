import { Request, Response } from "express";
import { comparePassword, signToken, verifyToken } from "../helpers/auth";
import type { AuthRequest, UserType } from "../Types/Types";
import User from "../models/User";
import { isValidEmail } from "../helpers/validation";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "../helpers/mailer";

export const verifyUserToken = async (req: AuthRequest, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(400).json({ message: "No token provided" });
    return;
  }
  const verify = await verifyToken(token);
  if (!verify) {
    res.status(401).json({ message: "Invalid Token" });
    return;
  }
  res.json({ verify });
  return;
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ error: "No refresh token found" });
    return;
  }

  try {
    // Verify the refresh token
    const decoded = (await verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    )) as {
      id: string;
    };
    if (!decoded) {
      res.status(403).json({ error: "Invalid refresh token" });
      return;
    }
    // Generate new Access Token
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(403).json({ error: "User not found" });
      return;
    }
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phoneNumber,
      role: user.role,
    };
    const newAccessToken = await signToken({
      id: user.id,
      name: user.name as string,
      role: user.role as "admin" | "user",
    });
    res
      .cookie("token", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({ userData });
    return;
  } catch (error) {
    console.log(error);
    res.status(403).json({ error: "Invalid refresh token" });
    return;
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "logged out successfully" });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const requestPasswordReset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!isValidEmail(email)) {
      res.status(400).json({ error: "Invalid Email Format" });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    try {
      await sendEmail(
        user.email!,
        "Reset Your Password",
        `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
      );
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError);
      res.status(500).json({ error: "Failed to send reset email" });
      return;
    }
    res.json({ message: "Reset link sent to email", email: user.email });
    return;
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const verifyResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: { $exists: true },
      resetPasswordExpires: { $gt: new Date() }, // Check if token is not expired
    });

    if (!user || !(await bcrypt.compare(token, user.resetPasswordToken!))) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: { $exists: true },
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user || !(await bcrypt.compare(token, user.resetPasswordToken!))) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }
    console.log(password);
    user.password = await bcrypt.hash(password, 10);
    await user.updateOne({
      $unset: { resetPasswordToken: "", resetPasswordExpires: "" },
    });
    user.save();
    res.json({ message: "Password successfully reset" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
export default { verifyUserToken, logoutUser };
