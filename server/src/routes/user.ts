import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import {
  editUser,
  getUser,
  uploadProfileImage,
} from "../controllers/userController";
import upload from "../helpers/image";
const user = express.Router();

user.post("/edit", tokenAuth, editUser);
user.get("/get-user", tokenAuth, getUser);
user.post("/upload-image", upload.single("image"), uploadProfileImage);
export default user;
