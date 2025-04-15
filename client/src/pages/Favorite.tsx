// src/pages/Favorite.tsx
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import AdoptCards from "../components/Adopt/AdoptCards";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import { petType } from "../types/pet";
import { useFavoritePets } from "../hooks/useFavoritePets";

const Favorite = () => {
  const { data: favPetsData, isLoading } = useFavoritePets();
  const [favPets, setFavPets] = useState<petType[]>([]);

  useEffect(() => {
    if (favPetsData) setFavPets(favPetsData);
  }, [favPetsData]);

  if (isLoading && favPets.length === 0) {
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
