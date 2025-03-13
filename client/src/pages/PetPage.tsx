import { useParams } from "react-router";
import { useEffect, useState } from "react";
import serverAPI from "../helper/axios";
import PetCarousel from "../components/PetPage/PetCarousel";
import { SwiperClass } from "swiper/react";
import PetPageText from "../components/PetPage/PetPageText";
import type { petType } from "../types/pet";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import PageHeader from "../components/PageHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";

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
        const pet = data.data?.[0];
        setPetData(pet || null);
      })
      .catch((error) => {
        console.error("Error fetching pets:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <LoadingPage fadeOut={false} />;
  }

  if (!petData) {
    return (
      <>
        <PageHeader text="Pet Details" />
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-10 text-center bg-fixed bg-center bg-cover bg-no-repeat bg-[url(/assets/img/wallpaper.jpg)] text-orange-600 shadow-md rounded-lg mx-4">
          <FontAwesomeIcon icon={faPaw} size="3x" />
          <h2 className="text-3xl font-semibold font-primary">Pet Not Found</h2>
          <p className="text-gray-600 mt-2 font-secondary">
            The pet you're looking for doesn’t exist
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader text="Pet Details" />
      <div className="bg-orange-600">
        <div className="mx-auto rounded-t-xl bg-fixed bg-center bg-cover bg-no-repeat bg-[url(/assets/img/wallpaper.jpg)] p-4 h-full w-full flex max-md:flex-col">
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
            <PetPageText petData={petData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PetPage;
