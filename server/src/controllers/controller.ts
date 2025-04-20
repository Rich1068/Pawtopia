import { Response, Request } from "express";
import User from "../models/User";
import {
  comparePassword,
  generateToken,
  hashPassword,
  signRefreshToken,
  signToken,
} from "../helpers/auth";

import { validateRegister, validateLogin } from "../helpers/validation";
import { sendEmail } from "../helpers/mailer";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void | undefined> => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    if (!(await validateRegister(req, res))) return;

    const verifyToken = await generateToken();
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "user",
      verificationToken: verifyToken,
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;

    await sendEmail(
      email,
      "Verify Your Email",
      `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #f97316;">Welcome to Our Community!</h2>
        <p>Please verify your email address to get started.</p>
        <div style="margin: 20px 0;">
          <a href="${verifyUrl}" 
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

    res.status(200).json({
      message: "User registered. Please verify your email.",
      email: newUser.email,
    });

    return;
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
    const match = await comparePassword(password, user.password!);
    if (match) {
      if (!user.verified) {
        res
          .status(200)
          .json({ message: "Please Verify Email", email: user.email });
        return;
      }
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
