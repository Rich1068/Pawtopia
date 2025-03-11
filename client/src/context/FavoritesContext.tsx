import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { petType } from "../types/pet";
import { useAuth } from "./AuthContext";
import serverAPI from "../helper/axios";
import { FavoritePets } from "../types/Types";

interface IFavoritesContextType {
  favorites: FavoritePets[];
  toggleFavorite: (pet: petType) => Promise<void>; // Now returns a promise
}

const FavoritesContext = createContext<IFavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoritePets[]>([]);
  const { user, isAuthenticated } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    serverAPI
      .get(`/user/favorites`, { withCredentials: true })
      .then((res) => {
        console.log(res);
        return setFavorites(res.data);
      })
      .catch((error) => console.error("Failed to fetch favorites", error));
  }, [isAuthenticated, userId]);

  const toggleFavorite = async (pet: petType) => {
    if (!userId) return;
    setFavorites((prev) => {
      const isFavorite = prev.some((fav) => fav.petId === pet.id);

      return isFavorite
        ? prev.filter((fav) => fav.petId !== pet.id) // Remove if exists
        : [
            ...prev,
            {
              userId,
              petId: pet.id,
              petName: pet.attributes.name,
              petImage: pet.attributes.pictureThumbnailUrl,
            } as FavoritePets,
          ];
    });

    try {
      const { data } = await serverAPI.post(
        "/user/favorites",
        {
          userId,
          petId: pet.id,
          petName: pet.attributes.name,
          petImage: pet.attributes.pictureThumbnailUrl,
        },
        { withCredentials: true }
      );

      if (data.favorites) {
        console.log(data.favorites);
        setFavorites(data.favorites); // Use the updated list from the backend
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
