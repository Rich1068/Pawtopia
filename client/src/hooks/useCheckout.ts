import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCart } from "../context/CartContext";
import serverAPI from "../helper/axios";
import toast from "react-hot-toast";

// Custom hook to manage checkout cart logic
const useCheckout = () => {
  const { cart, addToCart, decreaseFromCart, removeFromCart } = useCart();
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null
  );
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const cartLength = cart?.products.length || 0;

  const hasInvalidItems =
    cart?.products.some(
      (item) => !item.productId || item.productId.isArchived
    ) ?? false;

  // Add product to the cart
  const handleAdd = async (productId: string) => {
    setUpdatingProductId(productId);
    try {
      addToCart(productId, 1);
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Decrease product quantity in the cart
  const handleDecrease = async (productId: string) => {
    setUpdatingProductId(productId);
    try {
      decreaseFromCart(productId, 1);
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Update total price whenever cart changes
  useEffect(() => {
    const totalPrice =
      cart?.products
        ?.filter(
          (
            prod
          ): prod is typeof prod & {
            productId: { price: number };
          } => !!prod.productId
        )
        .reduce(
          (sum, item) => sum + parseFloat(item.productId.price) * item.quantity,
          0
        ) ?? 0;
    setTotal(totalPrice);
  }, [cart]);

  // Handle checkout logic
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data } = await serverAPI.post(
        "/cart/checkout",
        { products: cart?.products },
        { withCredentials: true }
      );
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error", error);
      toast.error("Failed to process checkout. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  }, [queryClient]);

  return {
    cart,
    cartLength,
    total,
    loading,
    hasInvalidItems,
    handleAdd,
    handleDecrease,
    removeFromCart,
    handleCheckout,
    updatingProductId,
  };
};

export default useCheckout;
