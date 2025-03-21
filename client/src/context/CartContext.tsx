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

interface CartContextType {
  cart: ICart | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  decreaseFromCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ICart | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await serverAPI.get("/cart", {
          withCredentials: true,
        });

        setCart(data.cart);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCart();
  }, []);
  const addToCart = async (productId: string, quantity: number) => {
    try {
      const { data } = await serverAPI.post(
        "/cart/add",
        { productId, quantity },
        {
          withCredentials: true,
        }
      );
      setCart(data.cart);
    } catch (error) {
      console.log(error);
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
      setCart(data.cart);
    } catch (error) {
      console.log(error);
    }
  };
  const removeFromCart = async (cartItemId: string) => {
    try {
      const { data } = await serverAPI.delete(`/cart/${cartItemId}`, {
        withCredentials: true,
      });
      setCart(data.cart);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, decreaseFromCart, removeFromCart }}
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
