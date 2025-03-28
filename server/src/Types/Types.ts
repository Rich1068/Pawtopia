import { Request } from "express";
import mongoose from "mongoose";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}
export interface UserType {
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}

export interface IProduct {
  _id: string;
  images: string[];
  name: string;
  description: string;
  price: string;
  category: string[];
}

export interface ICartProduct {
  productId: mongoose.Types.ObjectId | IProduct;
  quantity: number;
}

export interface ICart {
  userId: mongoose.Types.ObjectId;
  products: ICartProduct[];
}
