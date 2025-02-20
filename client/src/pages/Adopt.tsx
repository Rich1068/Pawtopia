import axios from "axios";
import { useEffect, useState } from "react";
import Cards from "../components/Adopt/Cards";
import type { Pets } from "../types/petType";
import AdoptHeroSection from "../components/Adopt/AdoptHeroSection";
const Adopt = () => {
  const [pets, setPets] = useState<Pets>([])
  useEffect(() => {
    axios.get<Pets>("http://localhost:8000/pet/getAvailablePets").then(({data}) => {
        console.log(data)
        setPets(data)
    }).catch(error => {
      console.error("Error fetching pets:", error);
    });
  }, [])
    
  return (
    <>
      <div className="bg-orange-500 min-h-full max-h-full bottom-0">

      <AdoptHeroSection />
      <Cards pets={pets}/>
      </div>
    </>
  );
};

export default Adopt;
