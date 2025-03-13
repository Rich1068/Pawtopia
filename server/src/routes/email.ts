import express from "express";
import contact from "../controllers/emailController";
import tokenAuth from "../middlewares/tokenAuth";

const email = express.Router();

email.post("/send", tokenAuth, contact);

export default email;
