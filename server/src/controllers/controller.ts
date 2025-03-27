import { Response, Request } from "express";
import User from "../models/User";
import {
  comparePassword,
  hashPassword,
  signRefreshToken,
  signToken,
} from "../helpers/auth";
import { validateRegister, validateLogin } from "../helpers/validation";
import { sendEmail } from "../helpers/mailer";
import crypto from "crypto";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void | undefined> => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    if (!(await validateRegister(req, res))) return;

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "user",
      verified: false,
    });
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    const emailHtml = `
      <h2>Welcome to Pawtopia, ${name}!</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}" style="background:#f97316; padding:10px; color:white; text-decoration:none; border-radius:5px;">Verify Email</a>
    `;

    await sendEmail(email, "Verify Your Email", emailHtml);
    res.status(200).json({
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
    return;
  }
};
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email });

    if (!(await validateLogin(req, res))) return;

    //used for typescript validation for user
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (!user.verified) {
      res.status(200).json({
        requiresVerification: true,
        message: "Please verify your email first.",
      });
      return;
    }
    const match = await comparePassword(password, user.password!);
    if (match) {
      const accessToken = await signToken({
        id: user.id,
        name: user.name as string,
        role: user.role as "admin" | "user",
      });

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phoneNumber,
        role: user.role,
      };
      if (rememberMe) {
        const refreshToken = await signRefreshToken({ id: user.id });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }
      res
        .cookie("token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .status(200)
        .json({ userData });
    } else {
      res.status(401).json({ error: "Incorrect Password" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
    return;
  }
};

export default { registerUser, loginUser };
