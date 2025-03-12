/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Cards from "../components/Adopt/Cards";
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
        const response = await serverAPI.post("/pet/get-favPets", {
          petIds,
        });
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

  const cleanImageUrl = (url: string | undefined): string | undefined => {
    let cleanedUrl = url?.split("?")[0];
    cleanedUrl = cleanedUrl?.replace(/\/\d+(?=\.\w+$)/, "");
    cleanedUrl = cleanedUrl?.replace(/\.\w+$/, "");
    return cleanedUrl;
  };
  return (
    <>
      <PageHeader text={"My Favorites"} />
      <div className="min-h-screen px-[10%]">
        <Cards
          pets={favPets}
          cleanImageUrl={cleanImageUrl}
          header={"No Favorites Yet"}
          text={"Start adding pets to your favorites!"}
          cardClassName="!justify-start !gap-x-10"
        />
      </div>
    </>
  );
};

export default Favorite;
