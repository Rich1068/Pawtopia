import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { petType } from "../../types/pet";
import { Heart } from "lucide-react";
import { useState } from "react";
import WarningModal from "../WarningModal";

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
        data-testid={"favorite-button"}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
      >
        <Heart
          className={`w-6 h-6 ${
            isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"
          }`}
        />
      </button>

      <WarningModal
        header="Login Required"
        text="Please Login to Favorite Pets"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default FavoriteButton;
