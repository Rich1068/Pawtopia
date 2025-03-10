import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}
export interface UserType {
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}
