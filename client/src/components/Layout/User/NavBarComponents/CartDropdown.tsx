import { useCart } from "../../../../context/CartContext";
import { Link } from "react-router";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { getFullImageUrl } from "../../../../helper/imageHelper";
import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const CartDropdown = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null
  );
  const { cart, addToCart, decreaseFromCart, removeFromCart } = useCart();
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const cartProductCount = cart?.products?.length ?? 0;
  const queryClient = useQueryClient();

  const toggleCart = () => {
    // If we're opening the cart, refetch the latest data
    if (!isCartOpen) {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
    setIsCartOpen(!isCartOpen);
  };
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
      await decreaseFromCart(productId, 1);
    } finally {
      setUpdatingProductId(null);
    }
  };

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
        onClick={toggleCart}
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
                const product = prod.productId;
                const productId = product?._id;
                const isPermanentlyDeleted = !product;
                const isSoftDeleted = product?.isArchived;

                const productImage = isPermanentlyDeleted
                  ? "/assets/img/deleted-placeholder.jpg"
                  : getFullImageUrl(product.images?.[0]) ||
                    "/assets/img/Logo1.jpg";

                const productName = isPermanentlyDeleted
                  ? "Product not available"
                  : product.name;

                const productPrice = isPermanentlyDeleted
                  ? 0
                  : parseFloat(product.price) || 0;

                const totalPrice = (productPrice * prod.quantity).toFixed(2);

                return (
                  <li
                    key={prod._id || product?._id || Math.random()}
                    className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 py-3 ${
                      isPermanentlyDeleted ? "opacity-50" : ""
                    }`}
                  >
                    {/* Product Image */}
                    <div className="flex items-center relative">
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-16 h-16 rounded-lg border text-sm border-gray-300 object-cover"
                      />
                      {isSoftDeleted && (
                        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md uppercase z-10">
                          Unavailable
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div>
                      <Link to={`/shop/product/${product?._id}`}>
                        <h3 className="text-sm font-semibold">{productName}</h3>
                      </Link>
                      <p className="text-xs text-gray-500">
                        {isPermanentlyDeleted
                          ? "Unavailable"
                          : `$${productPrice.toFixed(2)}`}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded"
                        onClick={() => handleDecrease(productId!)}
                        disabled={
                          isPermanentlyDeleted ||
                          prod.quantity <= 1 ||
                          isSoftDeleted ||
                          updatingProductId === product._id
                        }
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
                        className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded"
                        onClick={() => handleAdd(productId!)}
                        disabled={
                          isPermanentlyDeleted ||
                          prod.quantity >= 99 ||
                          isSoftDeleted ||
                          updatingProductId === product._id
                        }
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    {/* Total Price & Remove Button */}
                    <div className="w-20 text-right">
                      <span
                        className={`block text-sm font-semibold ${
                          isPermanentlyDeleted ? "opacity-50" : ""
                        }`}
                      >
                        ${totalPrice}
                      </span>
                      <button
                        className="text-xs text-red-500 hover:text-red-700 transition relative !opacity-100"
                        onClick={() => removeFromCart(prod._id!)}
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
                    ?.filter(
                      (
                        prod
                      ): prod is typeof prod & {
                        productId: { price: number };
                      } => !!prod.productId
                    )
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
