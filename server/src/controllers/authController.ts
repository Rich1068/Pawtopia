import {Request, Response} from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../helpers/auth'

export const verifyUserToken = async (req: Request, res:Response) => {
    const token = req.cookies.token
    if(token){    
        const verify = await verifyToken(token)
        if(!verify) {
            res.status(401).json({message: "Invalid Token"})
        }
        res.json({verify})
    } else {
        res.status(400).json({ message: "No token provided" });
    }

}

export default verifyUserToken