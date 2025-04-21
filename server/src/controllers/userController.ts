import { Response, Request } from "express";
import User from "../models/User";
import { AuthRequest } from "../Types/Types";
import { hashPassword, comparePassword } from "../helpers/auth";
import { validateEdit, validateEditPassword } from "../helpers/validation";
import cloudinary from "../../cloudinary";
import Favorite from "../models/Favorite";
import streamifier from "streamifier";
import { UploadApiResponse } from "cloudinary";

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
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
      req.userId,
      { name, email, phoneNumber },
      { new: true }
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
      req.userId,
      { password: hashedPassword },
      { new: true }
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
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const userId = req.body.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check if there's an existing profile image
    if (user.profileImage) {
      const oldImageUrl = user.profileImage;
      const oldPublicId = oldImageUrl
        .split("/")
        .slice(-2)
        .join("/")
        .replace(/\.[^/.]+$/, "");

      if (oldPublicId) {
        try {
          const deleteResult = await cloudinary.uploader.destroy(oldPublicId);
          console.log("Old image deleted:", deleteResult);
        } catch (deleteError) {
          console.error(
            "Failed to delete old image from Cloudinary:",
            deleteError
          );
        }
      }
    }

    // Upload new image to Cloudinary
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "profile_images",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Upload failed"));
          }
          resolve(result);
        }
      );
      streamifier.createReadStream(req.file!.buffer).pipe(stream);
    });

    const imageUrl = result.secure_url;

    user.profileImage = imageUrl;
    await user.save();

    res.json({
      message: "Image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const favorites = await Favorite.find({ userId });

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const toggleFavorite = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { petId, petName, petImage } = req.body;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: No user ID provided" });
      return;
    }
    const existingFavorite = await Favorite.findOne({ userId, petId });

    if (existingFavorite) {
      await Favorite.findOneAndDelete({ userId, petId });
      res.json({ message: "Removed from favorites" });
      return;
    } else {
      const newFavorite = new Favorite({ userId, petId, petName, petImage });
      await newFavorite.save();
      res.json({ message: "Added to favorites" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export default {
  getUser,
  editUser,
  editPassword,
  getUserFavorites,
  toggleFavorite,
};
