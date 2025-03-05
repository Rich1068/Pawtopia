import { Request, Response } from "express";
import User from "../models/User";
import { comparePassword } from "./auth";
import { AuthRequest } from "../Types/Types";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\d{11}$/;
  return phoneRegex.test(phoneNumber);
};

const doPasswordsMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

const isUserExists = async (email: string): Promise<boolean> => {
  const userExists = await User.findOne({ email });
  return !!userExists;
};

export const validateRegister = async (
  req: Request,
  res: Response
): Promise<boolean> => {
  const { name, email, phoneNumber, password, confirmPassword } = req.body;

  if (!name || !email || !phoneNumber || !password || !confirmPassword) {
    res.status(400).json({ error: "All fields are required" });
    return false;
  }

  if (await isUserExists(email)) {
    res.status(409).json({ error: "Email already registered" });
    return false;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return false;
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    res.status(400).json({ error: "Invalid phone number format" });
    return false;
  }

  if (!doPasswordsMatch(password, confirmPassword)) {
    res.status(400).json({ error: "Passwords do not match" });
    return false;
  }

  return true;
};

export const validateLogin = async (
  req: Request,
  res: Response
): Promise<boolean> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return false;
  }
  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return false;
  }

  if (!(await isUserExists(email))) {
    res.status(404).json({ error: "User does not exist" });
    return false;
  }
  return true;
};

export const validateEdit = (req: Request, res: Response): boolean => {
  const { name, email, phoneNumber } = req.body;

  if (!name || !email || !phoneNumber) {
    res.status(400).json({ error: "All fields are required" });
    return false;
  }
  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return false;
  }
  if (!isValidPhoneNumber(phoneNumber)) {
    res.status(400).json({ error: "Invalid phone number format" });
    return false;
  }
  return true;
};

export const validateEditPassword = async (
  req: AuthRequest,
  res: Response
): Promise<boolean> => {
  const { password, confirmPassword } = req.body;
  const user = await User.findById(req.userId);
  const isSamePassword = await comparePassword(
    password,
    user?.password as string
  );
  if (!password || !confirmPassword) {
    res.status(400).json({ error: "All fields are required" });
    return false;
  }
  if (!doPasswordsMatch(password, confirmPassword)) {
    res.status(400).json({ error: "Passwords do not match" });
    return false;
  }
  if (isSamePassword) {
    res.status(400).json({
      error: "New password must be different from the old password",
    });
    return false;
  }
  return true;
};
export default {
  validateRegister,
  validateLogin,
  validateEdit,
  validateEditPassword,
};
