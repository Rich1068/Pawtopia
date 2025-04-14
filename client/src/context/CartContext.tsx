import { createContext, useContext, ReactNode, FC } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import serverAPI from "../helper/axios";
import type { ICart } from "../types/Types";
import { useAuth } from "./AuthContext";

// Fetch cart from server
const fetchCart = async () => {
  const { data } = await serverAPI.get("/cart", {
    withCredentials: true,
  });
  return data.cart ?? null;
};

// Mutation to add product to cart
const addToCartMutation = async ({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) => {
  const { data } = await serverAPI.post(
    "/cart/add",
    { productId, quantity },
    {
      withCredentials: true,
    }
  );
  return data;
};

// Mutation to decrease product from cart
const decreaseFromCartMutation = async ({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) => {
  const { data } = await serverAPI.post(
    "/cart/decrease",
    { productId, quantity },
    {
      withCredentials: true,
    }
  );
  return data;
};

// Mutation to remove product from cart
const removeFromCartMutation = async (cartItemId: string) => {
  const { data } = await serverAPI.delete(`/cart/${cartItemId}`, {
    withCredentials: true,
  });
  return data;
};

interface CartContextType {
  cart: ICart | null;
  isCartLoading: boolean;
  addToCart: (productId: string, quantity: number) => void;
  isAddingToCart: boolean;
  decreaseFromCart: (productId: string, quantity: number) => void;
  isDecreasingFromCart: boolean;
  removeFromCart: (cartItemId: string) => void;
  isRemovingFromCart: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Fetch cart data with useQuery
  const { data: cart, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!isAuthenticated && !!user?._id,
    staleTime: 0,
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
  });

  // Mutations for cart actions
  const { mutate: addToCartMutate, isPending: isAddingToCart } = useMutation({
    mutationFn: addToCartMutation,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to add to cart");
    },
  });

  const { mutate: decreaseFromCartMutate, isPending: isDecreasingFromCart } =
    useMutation({
      mutationFn: decreaseFromCartMutation,
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        toast.error(
          error.response?.data?.error || "Failed to decrease cart quantity"
        );
      },
    });

  const { mutate: removeFromCartMutate, isPending: isRemovingFromCart } =
    useMutation({
      mutationFn: removeFromCartMutation,
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        toast.error(
          error.response?.data?.error || "Failed to remove item from cart"
        );
      },
    });

  // Create wrapper functions with the correct parameter signature
  const addToCart = (productId: string, quantity: number) => {
    addToCartMutate({ productId, quantity });
  };

  const decreaseFromCart = (productId: string, quantity: number) => {
    decreaseFromCartMutate({ productId, quantity });
  };

  const removeFromCart = (cartItemId: string) => {
    removeFromCartMutate(cartItemId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartLoading,
        addToCart,
        isAddingToCart,
        decreaseFromCart,
        isDecreasingFromCart,
        removeFromCart,
        isRemovingFromCart,
      }}
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
