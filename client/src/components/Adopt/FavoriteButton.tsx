import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { petType } from "../../types/pet";
import { Heart } from "lucide-react";
import { useState } from "react";
import Modal from "react-modal";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";

interface FavoriteButtonProps {
  pet: petType;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ pet }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFavorited = favorites.some((fav) => fav.petId === pet.id); // Ensure consistent key

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    try {
      await toggleFavorite(pet); // Ensure UI updates only after API response
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  return (
    <>
      <button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
      >
        <Heart
          className={`w-6 h-6 ${
            isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"
          }`}
        />
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white w-96 flex flex-col p-6 rounded-lg shadow-lg max-w-sm mx-auto font-primary"
        overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-center"
        ariaHideApp={false} // Disable warning in development
      >
        <div className=" text-orange-600 rounded-lg flex flex-col items-center text-center left-0 right-0 mx-auto">
          <FontAwesomeIcon icon={faPaw} size="3x" />
          <h2 className="text-2xl font-semibold text-gray-700">
            Login Required
          </h2>
          <p className="text-gray-500">Please Login to Favorite Pets</p>
          <div className="flex gap-x-5 m-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded-md ring-orange-500"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
            <Link to={"/login"}>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-md">
                Log In
              </button>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FavoriteButton;
