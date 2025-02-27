import { Request, Response } from "express";
import dotenv from "dotenv";
import { verifyToken } from "../helpers/auth";
import User from "../models/User";

import type { AuthRequest, UserType } from "../Types/Types";
export const verifyUserToken = async (req: AuthRequest, res: Response) => {
  const token = req.cookies.token;
  if (token) {
    const verify = await verifyToken(token);
    if (!verify) {
      res.status(401).json({ message: "Invalid Token" });
    }
    res.json({ verify });
  } else {
    res.status(400).json({ message: "No token provided" });
  }
};
export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: true });
    res.status(200).json({ message: "logged out successfully" });
    return;
  } catch (error) {
    console.log(error);
  }
};

// GET USER INFORMATION
export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password"); //query from database and exclude password
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default { verifyUserToken, logoutUser, getUser };
