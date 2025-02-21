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
  const [pets, setPets] = useState<Pets>([])
  useEffect(() => {
    axios.get<Pets>("http://localhost:8000/pet/getAvailablePets").then(({ data }) => {
      console.log("Fetched data:", data);
      
      let filtered = data;
      if (selected.dog && selected.cat) {
          filtered = data.filter((dataItem) => dataItem.category.name === 'Dogs' || dataItem.category.name === 'Cats');
      } else if (selected.dog) {
          filtered = data.filter((dataItem) => dataItem.category.name === 'Dogs');
      } else if (selected.cat) {
          filtered = data.filter((dataItem) => dataItem.category.name === 'Cats');
      }

      console.log("Filtered data:", filtered);
      setPets(filtered);
  }).catch(error => {
      console.error("Error fetching pets:", error);
    });
  }, [selected])
    
  return (
    <>
      <div className="bg-orange-500 min-h-full max-h-full bottom-0">

      <AdoptHeroSection selected={selected} setSelected={setSelected}/>
      <Cards pets={pets}/>
      </div>
    </>
  );
};

export default Adopt;
