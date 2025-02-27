import { PawPrint } from "lucide-react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { Pet } from "../types/Types";
import serverAPI from "../helper/axios";
import PetCarousel from "../components/PetPage/PetCarousel";
import { SwiperClass } from "swiper/react";
import PetHeader from "../components/PetPage/PetHeader";
import PetPageText from "../components/PetPage/PetPageText";

//TODO Need to create a new schema for pet since API doesnt have Description and other stuff
const PetPage = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [petData, setPetData] = useState<Pet | null>(null);
  const { id } = useParams();
  useEffect(() => {
    if (!id) return;

    const getPetData = async () => {
      try {
        const response = await serverAPI.get(`pet/get-pet-data/${id}`);
        setPetData(response.data);
        console.log(petData);
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };

    getPetData();
  }, [id]);

  return (
    <>
      <PetHeader />
      <div className="bg-orange-600">
        <div className=" mx-auto rounded-t-xl bg-white p-4 h-full w-full flex-grow bottom-0">
          <div className="flex justify-between items-start">
            {/* Left side - PetCarousel */}
            <div className="w-2/3">
              <PetCarousel
                thumbsSwiper={thumbsSwiper}
                setThumbsSwiper={setThumbsSwiper}
                petData={petData}
              />
            </div>

            {/* Right side - Pet Details */}
            <PetPageText id={id} petData={petData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PetPage;
