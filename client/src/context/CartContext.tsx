/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  FC,
} from "react";
import serverAPI from "../helper/axios";
import type { ICart } from "../types/Types";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: ICart | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  decreaseFromCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ICart | null>(null);
  const { user } = useAuth();
  const fetchCart = async () => {
    try {
      const { data } = await serverAPI.get("/cart", {
        withCredentials: true,
      });

      setCart(data.cart ?? null);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      const { data } = await serverAPI.post(
        "/cart/add",
        { productId, quantity },
        {
          withCredentials: true,
        }
      );
      await fetchCart();
      toast.success(data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.error || "Failed to add to cart"); // ✅ Handle errors safely
    }
  };

  const decreaseFromCart = async (productId: string, quantity: number) => {
    try {
      const { data } = await serverAPI.post(
        "/cart/decrease",
        { productId, quantity },
        {
          withCredentials: true,
        }
      );
      await fetchCart();
      toast.success(data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.error);
    }
  };
  const removeFromCart = async (cartItemId: string) => {
    try {
      const { data } = await serverAPI.delete(`/cart/${cartItemId}`, {
        withCredentials: true,
      });

      await fetchCart();
      toast.success(data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, addToCart, decreaseFromCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
