import { Response, Request } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { AuthRequest, IProduct } from "../Types/Types";
import mongoose from "mongoose";

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
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
    res.status(200).json({ message: "Item Added", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(200).json({ cart: null }); // Just return null cart without an error
      return;
    }
    const cart = await Cart.findOne({ userId })
      .populate("products.productId")
      .lean();

    if (!cart) {
      res.status(200).json({ cart: null }); // Return null if no cart exists
      return;
    }

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    return;
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { cartItemId } = req.params;
    const productObjectId = new mongoose.Types.ObjectId(cartItemId);
    console.log("product id " + cartItemId);
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId: productObjectId } } }, // Match by ObjectId
      { new: true }
    ).populate("products.productId");
    console.log("cart", cart);
    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    // If cart is empty after removal, delete it
    if (cart.products.length === 0) {
      await Cart.deleteOne({ userId });
      res.status(200).json({ message: "Cart is now empty" });
      return;
    }

    res.status(200).json({ message: "Item removed", cart: cart });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const decreaseFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
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

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};
