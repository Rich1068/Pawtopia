import { useCart } from "../../../../context/CartContext";
import { Link } from "react-router";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { getFullImageUrl } from "../../../../helper/imageHelper";
import { useState, useRef, useEffect } from "react";

const CartDropdown = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, addToCart, decreaseFromCart, removeFromCart } = useCart();
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const cartProductCount = cart?.products?.length ?? 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative max-sm:hidden" ref={cartDropdownRef}>
      <button
        className="relative p-2 text-orange-500 items-center mt-1"
        onClick={() => setIsCartOpen(!isCartOpen)}
      >
        <ShoppingCart size={28} />

        {cartProductCount > 0 && (
          <span className="absolute -top-0 -right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartProductCount}
          </span>
        )}
      </button>
      {isCartOpen && (
        <div className="absolute right-0 mt-2 w-100 lg:w-120  bg-white border border-orange-500 shadow-lg rounded-lg z-50">
          {/* Shopping Cart Title */}
          <div className="p-3 border-b border-orange-500 text-center font-semibold text-orange-600">
            Shopping Cart
          </div>

          {/* Cart Items List */}
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-300 px-3 text-amber-950">
            {cart && cartProductCount > 0 ? (
              cart.products.map((prod) => {
                const productImage =
                  getFullImageUrl(prod.productId.images?.[0]) ||
                  "/assets/img/Logo1.jpg";
                const productName = prod.productId.name;
                const productPrice = parseFloat(prod.productId.price) || 0;
                const totalPrice = (productPrice * prod.quantity).toFixed(2);

                return (
                  <li
                    key={prod._id || prod.productId._id}
                    className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 py-3"
                  >
                    {/* Product Image */}
                    <Link
                      to={`/shop/product/${prod.productId._id}`}
                      className="flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCartOpen(false);
                      }}
                    >
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-16 h-16 rounded-lg border border-gray-300 object-cover"
                      />
                    </Link>

                    {/* Product Info */}
                    <div>
                      <h3 className="text-sm font-semibold">{productName}</h3>
                      <p className="text-xs text-gray-500">
                        ${productPrice.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition"
                        onClick={() => decreaseFromCart(prod.productId._id, 1)}
                        disabled={prod.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        type="text"
                        value={prod.quantity}
                        readOnly
                        className="w-8 text-center border border-gray-300 rounded"
                      />
                      <button
                        className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition"
                        onClick={() => addToCart(prod.productId._id, 1)}
                        disabled={prod.quantity >= 99}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Total Price & Remove Button */}
                    <div className="w-20 text-right">
                      <span className="block text-sm font-semibold">
                        ${totalPrice}
                      </span>
                      <button
                        className="text-xs text-red-500 hover:text-red-700 transition"
                        onClick={() => removeFromCart(prod.productId._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="p-4 text-center text-gray-500">
                Your cart is empty
              </li>
            )}
          </ul>

          {/* Cart Subtotal */}
          {cartProductCount > 0 && (
            <div className="p-3 border-t border-orange-500">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <span>Subtotal:</span>
                <span>
                  $
                  {cart?.products
                    .reduce(
                      (sum, prod) =>
                        sum + parseFloat(prod.productId.price) * prod.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
            </div>
          )}
          {/* Checkout Button */}
          <div className="p-3 border-t border-orange-500 text-center">
            <Link
              to="/shop/checkout"
              className="block w-full py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
              onClick={(e) => {
                e.stopPropagation();
                setIsCartOpen(false);
              }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
