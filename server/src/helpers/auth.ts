import bcrypt from 'bcrypt'
import jwt, { JwtPayload, verify } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
export const hashPassword = async (password:string) => {
    try {
        return await bcrypt.hash(password, 10)
    } catch (error) {
        throw new Error('Error hashing password');
    }
    
}
export  const comparePassword = async (password:string, hashed:string) => {
    try {
        return await bcrypt.compare(password, hashed)
    } catch (error) {
        throw new Error('Error Comparing password');
    }  
}
export const signToken = async (user: { id: object; name: string, role: 'admin' | 'user'; }): Promise<string> => {
    try {
      // Use a custom promise wrapper for jwt.sign
      const token = await new Promise<string>((resolve, reject) => {
        jwt.sign(
          { id: user.id, name: user.name, role: user.role },
          process.env.JWT_SECRET!,
          {},
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
      throw new Error('Error creating token: ' + error);
    }
  };
  
  export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null; // Return null instead of throwing an error
    }
  };


export default {hashPassword, comparePassword, signToken, verifyToken}