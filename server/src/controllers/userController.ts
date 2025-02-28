import { Response, Request } from "express";
import User from "../models/User";
import { AuthRequest } from "../Types/Types";
import { hashPassword, comparePassword } from "../helpers/auth";
import { validateEdit, validateEditPassword } from "../helpers/validation";
import fs from "fs";
import path from "path";

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

    if (!validateEdit(req, res)) return;

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

export const editPassword = async (
  req: AuthRequest,
  res: Response
): Promise<void | undefined> => {
  try {
    const { password, confirmPassword } = req.body;

    if (!(await validateEditPassword(req, res))) return;

    const hashedPassword = await hashPassword(password);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId, // Use req.user.id instead of req.userId
      { password: hashedPassword },
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
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
    const userId = req.body.userId;
    const user = await User.findById(userId);
    const imagePath = `/assets/img/profile_pic/${req.file.filename}`;
    if (user?.profileImage) {
      const oldImagePath = path.join(__dirname, "..", user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image
      }
    }
    await User.findByIdAndUpdate(userId, { profileImage: imagePath }).exec();
    res.json({ message: "Image Uploaded Successfully", imageUrl: imagePath });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export default { getUser, editUser, editPassword };
