import { Response, Request } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { AuthRequest, ICartProduct } from "../Types/Types";
import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";
import { checkIfImageExists } from "../helpers/image";
import Order from "../models/Order";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
        res.status(200).json({ message: "Cart Updated", cart });
        await cart.save();
        return;
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

export const cartCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { products } = req.body;
    const userId = req.userId;
    if (!userId) {
      res.status(403).json({ error: "Please Login to Checkout" });
      return;
    }
    // Format line items for Stripe
    const lineItems = await Promise.all(
      products.map(async (item: ICartProduct) => {
        if (
          typeof item.productId === "object" &&
          "name" in item.productId &&
          "images" in item.productId &&
          "price" in item.productId
        ) {
          const imagePath = process.env.SERVER_URL + item.productId.images?.[0];
          const imageUrl = (await checkIfImageExists(imagePath))
            ? imagePath
            : process.env.CLIENT_URL + "/public/assets/img/Logo1.png";
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.productId.name,
                images: [imageUrl],
              },
              unit_amount: Math.round(parseFloat(item.productId.price) * 100),
            },
            quantity: item.quantity,
          };
        } else {
          throw new Error("Product not properly populated");
        }
      })
    );
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`,
      metadata: {
        userId: userId,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

export const handleCheckoutSuccess = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_KEY!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err);
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      const cart = await Cart.findOne({ userId }).populate(
        "products.productId"
      );

      if (cart) {
        const order = new Order({
          userId,
          products: cart.products.map((item: ICartProduct) => {
            if (
              typeof item.productId === "object" &&
              "name" in item.productId &&
              "images" in item.productId &&
              "price" in item.productId
            ) {
              console.log(session.id);
              return {
                productId: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                quantity: item.quantity,
              };
            }
          }),
          orderId: session.id,
          paymentId: session.payment_intent || "",
          totalAmount: session.amount_total! / 100,
        });
        await order.save();

        await Cart.findOneAndDelete({ userId });
      }
    }
  }

  res.json({ received: true });
};
