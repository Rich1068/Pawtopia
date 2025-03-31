import { FC, useState } from "react";
import type { IProduct } from "../../../types/Types";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import WarningModal from "../../WarningModal";

interface IUserButtons {
  product: IProduct;
}

const UserButtons: FC<IUserButtons> = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); // Warning modal state
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity((prev) => (prev < 99 ? prev + 1 : 99));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setQuantity(1);
      return;
    }

    const numValue = Number(value);
    if (!isNaN(numValue)) {
      if (numValue < 1) setQuantity(1);
      else if (numValue > 99) setQuantity(99);
      else setQuantity(numValue);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    addToCart(product._id, quantity);
    navigate("/shop/checkout");
  };

  const handleAddToCart = () => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    addToCart(product._id, quantity);
  };

  return (
    <>
      <div className="flex items-center gap-x-7">
        <strong className="font-secondary text-lg text-orange-500">
          Quantity:{" "}
        </strong>
        <div className="flex items-center space-x-2.5">
          <button
            className="px-3 py-1 bg-gray-200 rounded-md cursor-pointer"
            onClick={handleDecrease}
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="text"
            className="w-8 text-center text-lg rounded-md"
            value={quantity}
            onChange={handleQuantityChange}
            max={99}
          />
          <button
            className="px-3 py-1 bg-gray-200 rounded-md  cursor-pointer"
            onClick={handleIncrease}
          >
            +
          </button>
        </div>
      </div>
      <div className="mt-4 space-x-2">
        <button
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md cursor-pointer"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
        <button
          className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-md cursor-pointer"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
      <WarningModal
        header="Login Required"
        text="Please Login to Buy Products"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        confirmText="Log In"
        onConfirm={() => navigate("/login")}
      />
    </>
  );
};

export default UserButtons;
