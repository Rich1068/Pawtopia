import express from "express";
import tokenAuth from "../middlewares/tokenAuth";
import {
  addToCart,
  cartCheckout,
  decreaseFromCart,
  getCart,
  removeCartItem,
} from "../controllers/cartController";

const cart = express.Router();

cart.get("/", tokenAuth, getCart);
cart.post("/add", tokenAuth, addToCart);
cart.post("/decrease", tokenAuth, decreaseFromCart);
cart.delete("/:cartItemId", tokenAuth, removeCartItem);
cart.post("/checkout", tokenAuth, cartCheckout);

export default cart;
