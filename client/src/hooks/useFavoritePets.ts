import { useQuery } from "@tanstack/react-query";
import serverAPI from "../helper/axios";
import { useFavorites } from "../context/FavoritesContext";
import { petType } from "../types/pet";

export const useFavoritePets = () => {
  const { favorites } = useFavorites();
  const petIds = favorites.map((fav) => fav.petId);

  return useQuery<petType[]>({
    queryKey: ["favoritePets", petIds],
    queryFn: async () => {
      const { data } = await serverAPI.post(
        "/pet/get-favPets",
        { petIds },
        { withCredentials: true }
      );
      return data.pets;
    },
    enabled: petIds.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
