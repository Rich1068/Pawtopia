import { Response, Request } from "express";
import User from "../models/User";

import { comparePassword, hashPassword, signToken } from "../helpers/auth";

export const registerUser = async (req:Request, res:Response):Promise<void | undefined>  => {
    try {
        const {name, email, password, confirmPassword} = req.body
        const user = await User.findOne({email})
        if (!name || !email || !password || !confirmPassword) {
            res.status(400).json({ error: "All fields are required" })
            return 
        }
        if(user) {
            res.status(409).json({error: "Account already exists"})
            return
        }
        if(password !== confirmPassword) {
            res.status(400).json({error: "Password does not Match"})
            return
        }
        const hashedPassword = await hashPassword(password)
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user'
        })
        res.json({
            user: newUser
        })
        return
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Internal Server Error',
          });
        return 
    }
}
export const loginUser = async (req:Request, res:Response) => {
    try {
        const {email, password} = req.body
        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const checkUser = await User.findOne({email})

        if(!email || !password) {
            res.status(400).json({error: "All fields are required"})
            return
        }

        if (email && !emailCheck.test(email)) {
            res.status(400).json({error: "Invalid email format"})
            return
        }
        if(!checkUser) {
            res.status(404).json({error: "Account does not exist"})
            return
        } else{
            const match = await comparePassword(password, checkUser.password!)
            if(match) {
                const token = await signToken({
                    id: checkUser.id, 
                    role: checkUser.role as 'admin' | 'user'})
                    
                const userData = {
                    id: checkUser.id,
                    name: checkUser.name,
                    email: checkUser.email,
                    role: checkUser.role
                };
                res.cookie('token', token).status(200).json(userData)
            } else {
                res.status(401).json({error: "Incorrect Password"})
                return
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Internal Server Error',
          });
        return
    }
}

export default {registerUser, loginUser}