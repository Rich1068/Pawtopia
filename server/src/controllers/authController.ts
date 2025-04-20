import { Request, Response } from "express";
import { generateToken, signToken, verifyToken } from "../helpers/auth";
import type { AuthRequest } from "../Types/Types";
import User from "../models/User";
import { isValidEmail } from "../helpers/validation";
import bcrypt from "bcrypt";
import { sendEmail } from "../helpers/mailer";

export const verifyUserToken = async (req: AuthRequest, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    res.json({ verify: false });
    return;
  }

  const verify = await verifyToken(token);
  if (!verify) {
    res.json({ verify: false });
    return;
  }

  res.json({ verify });
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.json({ userData: null });
    return;
  }

  try {
    // Verify refresh token
    const decoded = (await verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    )) as {
      id: string;
    };

    if (!decoded) {
      res.json({ userData: null }); // Invalid refresh token
      return;
    }

    // Fetch user data
    const user = await User.findById(decoded.id);
    if (!user) {
      res.json({ userData: null }); // User no longer exists
      return;
    }

    // Generate new access token
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
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .json({ userData });
  } catch (error) {
    res.json({ userData: null });
    return;
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
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
      res.status(404).json({ message: "User not found" });
      return;
    }
    const hashedToken = await generateToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${hashedToken}`;
    try {
      await sendEmail(
        user.email!,
        "Reset Your Password",
        `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #f97316;">Reset Your Password</h2>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <div style="margin: 20px 0;">
            <a href="${resetUrl}" 
               style="
                 display: inline-block;
                 padding: 10px 20px;
                 background-color: #f97316;
                 color: white;
                 text-decoration: none;
                 border-radius: 6px;
                 font-weight: bold;
               ">
              Reset Password
            </a>
          </div>
          <p>If you didn’t request this, you can safely ignore this email.</p>
          <p style="font-size: 14px; color: #888;">This link will expire in 1 hour.</p>
          <p style="font-size: 14px; color: #888;">&mdash; The Support Team</p>
        </div>
        `
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
      resetPasswordToken: token,

      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
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
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }

    user.password = await bcrypt.hash(password, 10);

    await user!.updateOne({
      $unset: { resetPasswordToken: "", resetPasswordExpires: "" },
    });

    user.save();

    res.json({ message: "Password successfully reset" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Something went wrong" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }
    if (user.verified === true) {
      res.status(400).json({ error: "User already verified" });
      return;
    }
    await user.updateOne({
      $set: { verified: true },
      $unset: { verificationToken: "" },
    });

    res.json({
      message: "Email verified successfully.<br /> You can now log in.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    if (user.verified === true) {
      res.status(400).json({ error: "User is already verified" });
      return;
    }
    const verificationToken = await generateToken();
    user.verificationToken = verificationToken;

    await user.save();

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    await sendEmail(
      email,
      "Verify Your Email",
      `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #f97316;">Welcome to Our Community!</h2>
        <p>Please verify your email address to get started.</p>
        <div style="margin: 20px 0;">
          <a href="${verificationLink}" 
             style="
               display: inline-block;
               padding: 10px 20px;
               background-color: #f97316;
               color: white;
               text-decoration: none;
               border-radius: 6px;
               font-weight: bold;
             ">
            Verify Email
          </a>
        </div>
        <p>If you didn’t sign up, you can safely ignore this email.</p>
        <p style="font-size: 14px; color: #888;">&mdash; Pawtopia</p>
      </div>
      `
    );

    res.json({ message: "Verification email resent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
