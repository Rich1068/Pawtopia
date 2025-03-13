import bcrypt from "bcrypt";
import jwt, { JwtPayload, verify } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const hashPassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error("Error hashing password");
  }
};
export const comparePassword = async (password: string, hashed: string) => {
  try {
    return await bcrypt.compare(password, hashed);
  } catch (error) {
    throw new Error("Error Comparing password");
  }
};
export const signToken = async (user: {
  id: object;
  name: string;
  role: "admin" | "user";
}): Promise<string> => {
  try {
    // Use a custom promise wrapper for jwt.sign
    const token = await new Promise<string>((resolve, reject) => {
      jwt.sign(
        { id: user.id, name: user.name, role: user.role },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: "15m" },
        (error, token) => {
          if (error) {
            reject(error);
          } else {
            resolve(token!);
          }
        }
      );
    });

    return token;
  } catch (error) {
    throw new Error("Error creating token: " + error);
  }
};
export const signRefreshToken = async (user: {
  id: object;
}): Promise<string> => {
  try {
    const token = await new Promise<string>((resolve, reject) => {
      jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" },
        (error, token) => {
          if (error) reject(error);
          else resolve(token!);
        }
      );
    });

    return token;
  } catch (error) {
    throw new Error("Error creating refresh token: " + error);
  }
};
export const verifyToken = async (
  token: string,
  secret: string = process.env.JWT_ACCESS_SECRET!
): Promise<JwtPayload | null> => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

export default { hashPassword, comparePassword, signToken, verifyToken };
