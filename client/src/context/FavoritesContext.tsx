import { createContext, useContext, ReactNode } from "react";
import { petType } from "../types/pet";
import { useAuth } from "./AuthContext";
import serverAPI from "../helper/axios";
import { FavoritePets } from "../types/Types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface IFavoritesContextType {
  favorites: FavoritePets[];
  toggleFavorite: (pet: petType) => void;
  isLoading: boolean;
  refetchFavorites: () => void;
}

const FavoritesContext = createContext<IFavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?._id;
  const queryClient = useQueryClient();

  const {
    data: favorites = [],
    isLoading,
    refetch,
  } = useQuery<FavoritePets[]>({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      const res = await serverAPI.get(`/user/favorites`, {
        withCredentials: true,
      });
      return res.data;
    },
    enabled: !!userId && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async (pet: petType) => {
      return await serverAPI.post(
        "/user/favorites",
        {
          userId,
          petId: pet.id,
          petName: pet.attributes.name,
          petImage: pet.attributes.pictureThumbnailUrl,
        },
        { withCredentials: true }
      );
    },

    onMutate: async (pet) => {
      await queryClient.cancelQueries({ queryKey: ["favorites", userId] });

      const previousFavorites =
        queryClient.getQueryData<FavoritePets[]>(["favorites", userId]) || [];

      const previousFavoritePets =
        queryClient.getQueryData<petType[]>([
          "favoritePets",
          previousFavorites.map((f) => f.petId),
        ]) || [];

      const isAlreadyFavorited = previousFavorites.some(
        (fav) => fav.petId === pet.id
      );

      let newFavorites: FavoritePets[];
      let newFavoritePets: petType[];

      if (isAlreadyFavorited) {
        newFavorites = previousFavorites.filter((fav) => fav.petId !== pet.id);
        newFavoritePets = previousFavoritePets.filter((p) => p.id !== pet.id);
      } else {
        newFavorites = [
          ...previousFavorites,
          {
            petId: pet.id,
            petName: pet.attributes.name,
            petImage: pet.attributes.pictureThumbnailUrl as string,
            userId: userId as string,
          },
        ];
        newFavoritePets = [...previousFavoritePets, pet];
      }

      queryClient.setQueryData(["favorites", userId], newFavorites);
      queryClient.setQueryData(
        ["favoritePets", newFavorites.map((f) => f.petId)],
        newFavoritePets
      );

      return { previousFavorites, previousFavoritePets };
    },

    onError: (err, _pet, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          ["favorites", userId],
          context.previousFavorites
        );
      }
      console.error("Favorite update failed:", err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });

  const toggleFavorite = (pet: petType) => {
    if (!userId) return;
    mutation.mutate(pet);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isLoading,
        refetchFavorites: refetch,
      }}
    >
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
