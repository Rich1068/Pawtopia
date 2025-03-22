import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router";
import serverAPI from "../helper/axios";
import PageHeader from "../components/PageHeader";
import { Minus, Plus } from "lucide-react";
import { getFullImageUrl } from "../helper/imageHelper";

const Checkout = () => {
  const { cart, addToCart, decreaseFromCart, removeFromCart } = useCart();
  const [total, setTotal] = useState(0);
  const cartLength = cart?.products.length || 0;

  useEffect(() => {
    const totalPrice =
      cart?.products.reduce(
        (sum, item) => sum + parseFloat(item.productId.price) * item.quantity,
        0
      ) ?? 0;
    setTotal(totalPrice);
  }, [cart]);

  const handleCheckout = async () => {
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
    }
  };

  return (
    <>
      <PageHeader text="Checkout" />
      <div className="min-h-screen flex justify-center p-2 sm:p-6">
        <div className="bg-white max-w-3xl w-full p-4 sm:p-6 rounded-xl shadow-lg self-start">
          <h2 className="text-3xl font-primary font-semibold mb-6 text-orange-600 text-center">
            Shopping Cart
          </h2>

          {/* Cart Items */}
          {cartLength > 0 ? (
            <div className="border-b pb-4 space-y-4">
              {cart?.products.map((item) => (
                <div
                  key={item.productId._id}
                  className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[auto_1fr_auto_auto] gap-4 items-center bg-gray-50 p-4 rounded-md shadow-sm"
                >
                  {/* Product Image */}
                  <img
                    src={getFullImageUrl(item.productId.images[0])}
                    alt={item.productId.name}
                    className="w-16 h-16 object-cover rounded-md max-sm:hidden"
                  />

                  {/* Product Info */}
                  <div>
                    <Link to={`/shop/product/${item.productId._id}`}>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.productId.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500">
                      ${parseFloat(item.productId.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decreaseFromCart(item.productId._id, 1)}
                      className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                      disabled={item.quantity <= 1}
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
                      onClick={() => addToCart(item.productId._id, 1)}
                      className="p-1 bg-orange-500 hover:bg-orange-600 text-white rounded"
                      disabled={item.quantity >= 99}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-md font-semibold text-gray-700 text-right w-20 sm:w-25">
                    <div>
                      $
                      {(
                        parseFloat(item.productId.price) * item.quantity
                      ).toFixed(2)}
                      {/* Remove Button */}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId._id)}
                      className="text-red-500 text-sm hover:text-red-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}

          {/* Total Price */}
          <div className="flex justify-between items-center mt-6 text-lg font-semibold">
            <span className="text-gray-800">Total:</span>
            <span className="text-orange-600">${total.toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="w-full mt-6 bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700 transition"
          >
            Proceed to Payment
          </button>

          {/* Continue Shopping Link */}
          <Link
            to="/shop"
            className="block text-center mt-4 text-orange-500 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
};

export default Checkout;
