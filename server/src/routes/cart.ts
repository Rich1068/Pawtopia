import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import {
  addToCart,
  decreaseFromCart,
  getCart,
  removeCartItem,
} from "../controllers/cartController";

const cart = express.Router();

cart.get("/:userId", tokenAuth, getCart);
cart.post("/add", tokenAuth, addToCart);
cart.post("/decrease", tokenAuth, decreaseFromCart);
cart.delete("/:cartItemId", tokenAuth, removeCartItem);

export default cart;
