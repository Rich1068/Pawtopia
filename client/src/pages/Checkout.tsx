import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router";
import serverAPI from "../helper/axios";
import PageHeader from "../components/PageHeader";
import { LoaderCircle, Minus, Plus } from "lucide-react";
import { getFullImageUrl } from "../helper/imageHelper";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const Checkout = () => {
  const { cart, addToCart, decreaseFromCart, removeFromCart } = useCart();
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null
  );
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const cartLength = cart?.products.length || 0;
  const queryClient = useQueryClient();

  const hasInvalidItems =
    cart?.products.some(
      (item) => !item.productId || item.productId.isArchived
    ) ?? false;
  const handleAdd = async (productId: string) => {
    setUpdatingProductId(productId);
    try {
      await addToCart(productId, 1);
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleDecrease = async (productId: string) => {
    setUpdatingProductId(productId);
    try {
      decreaseFromCart(productId, 1);
    } finally {
      setUpdatingProductId(null);
    }
  };
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  }, [queryClient]);

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

  return (
    <>
      <PageHeader text="Checkout" />
      <div className="min-h-screen flex justify-center p-2 sm:p-6">
        <div className="bg-white max-w-3xl w-full p-4 sm:p-6 rounded-xl shadow-lg self-start">
          <h2
            className="text-3xl font-primary font-semibold mb-6 text-orange-600 text-center"
            data-testid="cart-title"
          >
            Shopping Cart
          </h2>
          {cartLength > 0 ? (
            <div className="border-b pb-4 space-y-4 font-secondary">
              {cart?.products.map((item) => {
                const product = item.productId;
                const productId = product?._id;
                const isPermanentlyDeleted = !product;
                const isArchived = product?.isArchived;
                const productName = isPermanentlyDeleted
                  ? "Product not available"
                  : product.name;

                const productPrice = isPermanentlyDeleted
                  ? 0
                  : parseFloat(product.price);

                return (
                  <div
                    key={product?._id || Math.random()}
                    className={`grid grid-cols-[1fr_auto_auto] sm:grid-cols-[auto_1fr_auto_auto] gap-4 items-center overflow-hidden bg-gray-50 p-4 rounded-md shadow-sm ${
                      isPermanentlyDeleted ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="relative w-16 h-16 ">
                        <img
                          src={
                            isPermanentlyDeleted
                              ? "/assets/img/deleted-placeholder.jpg"
                              : getFullImageUrl(product.images[0])
                          }
                          alt={productName}
                          className="w-full h-full object-cover rounded-md"
                        />
                        {isArchived && (
                          <div className="absolute -top-2 -right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md uppercase z-10">
                            Unavailable
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      {product && (
                        <Link to={`/shop/product/${product._id}`}>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {productName}
                          </h3>
                        </Link>
                      )}
                      {!product && (
                        <h3 className="text-lg font-semibold text-gray-800">
                          {productName}
                        </h3>
                      )}
                      <p className="text-sm text-gray-500">
                        {isPermanentlyDeleted
                          ? "Unavailable"
                          : `$${productPrice.toFixed(2)}`}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDecrease(productId!)}
                        className="p-1 bg-gray-200 rounded"
                        disabled={
                          isPermanentlyDeleted ||
                          item.quantity <= 1 ||
                          updatingProductId === product._id
                        }
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-8 text-center border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => handleAdd(productId!)}
                        className={`p-1 rounded ${
                          isPermanentlyDeleted || isArchived
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                        disabled={
                          isPermanentlyDeleted ||
                          isArchived ||
                          item.quantity >= 99 ||
                          updatingProductId === product._id
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-md font-semibold text-gray-700 text-right w-20 sm:w-25">
                      <div>${(productPrice * item.quantity).toFixed(2)}</div>
                      <button
                        onClick={() => removeFromCart(item._id!)}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p
              className="text-center text-gray-500 font-secondary"
              data-testid="empty-cart-message"
            >
              Your cart is empty.
            </p>
          )}

          <div className="flex justify-between items-center mt-6 text-lg font-semibold font-secondary">
            <span className="text-gray-800">Total:</span>
            <span className="text-orange-600" data-testid="cart-total">
              ${total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className={`w-full font-secondary mt-6 py-3 rounded-md font-semibold flex items-center justify-center gap-2 ${
              hasInvalidItems
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600 transition"
            }`}
            disabled={loading || hasInvalidItems}
          >
            {loading ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              "Proceed to Payment"
            )}
          </button>

          {hasInvalidItems && (
            <p className="mt-2 text-red-500 text-sm text-center">
              Please remove unavailable products before checkout.
            </p>
          )}

          <Link
            to="/shop"
            className="block text-center font-secondary mt-4 text-orange-500 hover:underline"
            data-testid="continue-shopping-link"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
};

export default Checkout;
