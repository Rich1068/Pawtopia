import {Request, Response} from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../helpers/auth'

export const verifyUserToken = async (req: Request, res:Response) => {
    const token = req.body.token
    if(token){    
        const verify = await verifyToken(token)
        if(!verify) {
            res.json({message: "Invalid Token"})
        }
        res.json({verify})
    } else {
        res.status(400).json({ message: "No token provided" });
    }

}

export default verifyUserToken