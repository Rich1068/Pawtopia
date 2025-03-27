import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../helpers/auth";
import { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../Types/Types";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
      res.status(401).json({ error: "Unauthorized. Please Login" });
      return;
    }

    const decoded = await verifyToken(token); // Decode & verify token
    if (!decoded) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }
    if (decoded === "expired") {
      res.status(401).json({ error: "Token Expired" });
      return;
    }
    //requests the ID of the user of the token
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export default authMiddleware;
