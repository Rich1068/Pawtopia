import { Response, NextFunction } from "express";
import type { AuthRequest } from "../Types/Types";
import authMiddleware from "./tokenAuth";

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First, run the authMiddleware to verify user authentication
    await authMiddleware(req, res, async () => {
      if (req.userRole !== "admin") {
        res.status(403).json({ error: "Forbidden. Admin access only" });
        return;
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export default adminMiddleware;
