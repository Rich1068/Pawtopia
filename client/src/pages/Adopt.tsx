import axios from "axios";
import { useEffect, useState } from "react";
import Cards from "../components/Adopt/Cards";
import type { Pets } from "../types/Types";
import AdoptHeroSection from "../components/Adopt/AdoptHeroSection";
const Adopt = () => {

  const [selected, setSelected] = useState<{dog:boolean; cat: boolean}>({
    dog: true,
    cat: true,
  });
  const [allPets, setAllPets] = useState<Pets>([]);
  const [pets, setPets] = useState<Pets>([])


  useEffect(() => {
    axios.get<Pets>("http://localhost:8000/pet/getAvailablePets").then(({ data }) => {
        console.log("Fetched data:", data);
        setAllPets(data);  // Store original data
      })
      .catch((error) => {
        console.error("Error fetching pets:", error);
      });
  }, []);  // ✅ Fetch only once on mount

  useEffect(() => {
    const filtered = allPets.filter((pet) => 
      (selected.dog && pet.category.name === "Dogs") ||
      (selected.cat && pet.category.name === "Cats")
    );
    console.log("Filtered data:", filtered);
    setPets(filtered);
  }, [selected, allPets]);
    

  return (
    <>
      <div className="bg-orange-500 min-h-screen flex flex-col">

      <AdoptHeroSection selected={selected} setSelected={setSelected}/>
      <Cards pets={pets}/>
      </div>
    </>
  );
};

export default Adopt;
