import { Response, Request } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { AuthRequest } from "../Types/Types";
import mongoose from "mongoose";

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      const productIndex = cart.products.findIndex((p) =>
        p.productId.equals(productId)
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    res.status(200).json(cart);
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
    const productObjectId = new mongoose.Types.ObjectId(productId);
    cart.products.pull({ productId: productObjectId });

    if (cart.products.length === 0) {
      await Cart.deleteOne({ userId });
      res.status(200).json({ message: "Cart is now empty" });
      return;
    }

    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    return;
  }
};

export const decreaseFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    const productIndex = cart.products.findIndex((p) =>
      p.productId.equals(productId)
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity -= 1;

      if (cart.products[productIndex].quantity <= 0) {
        cart.products.splice(productIndex, 1);
      }
    } else {
      res.status(404).json({ error: "Product not in cart" });
      return;
    }

    if (cart.products.length === 0) {
      await Cart.deleteOne({ userId });
      res.status(200).json({ message: "Cart is now empty" });
      return;
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};
