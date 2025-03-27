import { useParams } from "react-router";
import { useEffect, useState } from "react";
import serverAPI from "../helper/axios";
import PetCarousel from "../components/PetPage/PetCarousel";
import PetPageText from "../components/PetPage/PetPageText";
import type { petType } from "../types/pet";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import PageHeader from "../components/PageHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { cleanImageUrl } from "../helper/imageHelper";
import AdoptionForm from "../components/PetPage/AdoptionForm";

const PetPage = () => {
  const [petData, setPetData] = useState<petType | null>(null);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

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
        <div className="mx-auto rounded-t-xl px-[6%] py-4 bg-fixed bg-center bg-cover bg-no-repeat bg-[url(/assets/img/wallpaper.jpg)] h-full w-full ">
          {/* Left side - PetCarousel */}
          <div className="flex max-lg:flex-col gap-x-4 ">
            <div className="flex-1 min-w-[50% justify-center">
              <PetCarousel petData={petData} cleanImageUrl={cleanImageUrl} />
            </div>
            {/* Right side - PetPageText */}
            <div className="flex-1 justify-center ">
              <PetPageText petData={petData} setIsFormOpen={setIsFormOpen} />
            </div>
          </div>
          <div className="">
            {isFormOpen && (
              <AdoptionForm
                petId={petData.id}
                petName={petData.attributes.name}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PetPage;
