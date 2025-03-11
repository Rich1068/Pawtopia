import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import {
  editUser,
  getUser,
  uploadProfileImage,
  editPassword,
  getUserFavorites,
  toggleFavorite,
} from "../controllers/userController";
import upload from "../helpers/image";

const user = express.Router();

user.post("/edit", tokenAuth, editUser);
user.post("/edit-password", tokenAuth, editPassword);
user.get("/get-user", tokenAuth, getUser);
user.post("/upload-image", upload.single("image"), uploadProfileImage);
user.get("/favorites", tokenAuth, getUserFavorites);
user.post("/favorites", tokenAuth, toggleFavorite);

export default user;
