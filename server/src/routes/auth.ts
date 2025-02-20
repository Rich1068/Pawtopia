import express from "express";
import { verifyUserToken } from "../controllers/authController";
const auth = express.Router()


auth.post('/verify-token', verifyUserToken)

export default auth