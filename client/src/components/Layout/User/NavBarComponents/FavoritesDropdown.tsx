import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useFavorites } from "../../../../context/FavoritesContext";

const FavoriteDropdown = () => {
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);
  const { favorites } = useFavorites();
  const favoriteDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        favoriteDropdownRef.current &&
        !favoriteDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFavoriteOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative max-sm:hidden" ref={favoriteDropdownRef}>
      <button
        className="relative p-2 text-orange-500 items-center mt-1"
        onClick={() => setIsFavoriteOpen(!isFavoriteOpen)}
      >
        <Heart size={28} />
        {favorites.length > 0 && (
          <span className="absolute -top-0 -right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {favorites.length}
          </span>
        )}
      </button>

      {isFavoriteOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-orange-500 shadow-lg rounded-lg z-50">
          <ul className="max-h-60 overflow-y-auto divide-y divide-gray-300 mx-3 font-primary text-amber-950">
            {favorites.length > 0 ? (
              favorites.map((pet) => (
                <Link
                  to={`/adopt/pets/${pet.petId}`}
                  className="flex items-center p-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents dropdown from closing
                    setIsFavoriteOpen(false); // Closes after navigation
                  }}
                  key={pet.petId}
                >
                  <li key={pet.petId} className="flex items-center p-2">
                    <img
                      src={pet.petImage || "/assets/img/Logo1.jpg"}
                      alt={pet.petName}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <span className="text-sm">{pet.petName}</span>
                  </li>
                </Link>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">
                No favorites yet
              </li>
            )}
          </ul>

          <div className="p-2 border-t border-orange-500 text-center font-primary">
            <Link
              to="/favorites"
              className="text-orange-600 hover:underline"
              onClick={(e) => {
                e.stopPropagation(); // Prevents dropdown from closing
                setIsFavoriteOpen(false); // Closes after navigation
              }}
            >
              Show All
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteDropdown;
