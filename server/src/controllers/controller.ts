import { Response, Request } from "express";
import User from "../models/User";
import {
  comparePassword,
  hashPassword,
  signToken,
  verifyToken,
} from "../helpers/auth";
import { validateRegister, validateLogin } from "../helpers/validation";

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
    });
    res.json({
      user: newUser,
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
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!(await validateLogin(req, res))) return;

    //used for typescript validation for user
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const match = await comparePassword(password, user.password!);
    if (match) {
      const token = await signToken({
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
      res
        .cookie("token", token, { httpOnly: true, secure: true })
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
