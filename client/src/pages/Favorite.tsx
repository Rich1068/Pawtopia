/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AdoptCards from "../components/Adopt/AdoptCards";
import PageHeader from "../components/PageHeader";
import { useFavorites } from "../context/FavoritesContext";
import serverAPI from "../helper/axios";
import { petType } from "../types/pet";
import LoadingPage from "../components/LoadingPage/LoadingPage";

const Favorite = () => {
  const { favorites } = useFavorites();
  const [favPets, setFavPets] = useState<petType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchFavoritePets = async () => {
      if (favorites.length === 0) {
        setIsLoading(false);
        return;
      }
      try {
        const petIds = favorites.map((fav) => fav.petId);
        const response = await serverAPI.post(
          "/pet/get-favPets",
          {
            petIds,
          },
          { withCredentials: true }
        );
        setFavPets(response.data.pets);
      } catch (error) {
        console.error("Failed to fetch favorite pets", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoritePets();
  }, [favorites]);

  if (isLoading === true) {
    return <LoadingPage fadeOut={false} />;
  }

  return (
    <>
      <PageHeader text={"My Favorites"} />
      <div className="min-h-screen px-[10%]">
        <AdoptCards
          pets={favPets}
          header={"No Favorites Yet"}
          text={"Start adding pets to your favorites!"}
        />
      </div>
    </>
  );
};

export default Favorite;
