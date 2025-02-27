import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import { editUser } from "../controllers/userController";
const user = express.Router();

user.post("/edit", tokenAuth, editUser);

export default user;
