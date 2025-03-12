import express from "express";
import contact from "../controllers/emailController";

const email = express.Router();

email.post("/send", contact);

export default email;
