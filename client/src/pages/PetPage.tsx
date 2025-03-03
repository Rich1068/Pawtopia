import { useParams } from "react-router";
import { useEffect, useState } from "react";
import serverAPI from "../helper/axios";
import PetCarousel from "../components/PetPage/PetCarousel";
import { SwiperClass } from "swiper/react";
import PetHeader from "../components/PetPage/PetHeader";
import PetPageText from "../components/PetPage/PetPageText";
import type { petType } from "../types/pet";
import LoadingPage from "../components/LoadingPage/LoadingPage";

const PetPage = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [petData, setPetData] = useState<petType | null>(null);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const cleanImageUrl = (url: string | undefined): string | undefined => {
    let cleanedUrl = url?.split("?")[0];
    cleanedUrl = cleanedUrl?.replace(/\/\d+(?=\.\w+$)/, "");
    cleanedUrl = cleanedUrl?.replace(/\.\w+$/, "");
    return cleanedUrl;
  };
  useEffect(() => {
    if (!id) return;
    serverAPI
      .get(`pet/get-pet-data/${id}`)
      .then(({ data }) => {
        setPetData(data.data[0]);
        console.log(data.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching pets:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading === true) {
    return <LoadingPage fadeOut={false} />;
  }
  return (
    <>
      <PetHeader />
      <div className="bg-orange-600">
        <div className="mx-auto rounded-t-xl bg-white p-4 h-full w-full flex max-md:flex-col">
          {/* Left side - PetCarousel */}
          <div className="flex-1 min-w-[50%] flex justify-center">
            <PetCarousel
              thumbsSwiper={thumbsSwiper}
              setThumbsSwiper={setThumbsSwiper}
              petData={petData}
              cleanImageUrl={cleanImageUrl}
            />
          </div>

          {/* Right side - PetPageText */}
          <div className="flex-1 min-w-[50%] flex justify-center">
            <PetPageText id={id} petData={petData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PetPage;
