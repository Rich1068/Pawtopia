import { Response, Request } from "express";
import User from "../models/User";
import { AuthRequest } from "../Types/Types";
import { comparePassword, hashPassword, signToken, verifyToken } from "../helpers/auth";


export const editUser = async (req:AuthRequest, res:Response):Promise<void | undefined>  => {
    try {
        const {name, email} = req.body
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,  // Use req.user.id instead of req.userId
            { name, email },
            { new: true } // Return the updated user
        );

        if (!updatedUser) {
            res.status(404).json({ message: "User not found" })
            return 
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
    }
}