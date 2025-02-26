import { Response, Request } from "express";
import User from "../models/User";
import { AuthRequest } from "../Types/Types";
import {
  comparePassword,
  hashPassword,
  signToken,
  verifyToken,
} from "../helpers/auth";

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

export const editUser = async (
  req: AuthRequest,
  res: Response
): Promise<void | undefined> => {
  try {
    const { name, email, phoneNumber } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId, // Use req.user.id instead of req.userId
      { name, email, phoneNumber },
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const uploadProfileImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const imagePath = `/assets/img/profile_pic/${req.file.filename}`;
    const userId = req.body.userId;
    await User.findByIdAndUpdate(userId, { profileImage: imagePath });
    res.json({ message: "Image Uploaded Successfulyy", imageUrl: imagePath });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export default { getUser, editUser };
