import { useState } from "react";
import PetCarousel from "../components/PetPage/PetCarousel";
import PetPageText from "../components/PetPage/PetPageText";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import PageHeader from "../components/PageHeader";
import { cleanImageUrl } from "../helper/imageHelper";
import AdoptionForm from "../components/PetPage/AdoptionForm";
import { usePetData } from "../hooks/usePets";
import WarningContainer from "../components/WarningContainer";

const PetPage = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const { data: petData, isLoading, isError } = usePetData();

  if (isLoading) {
    return <LoadingPage fadeOut={false} />;
  }

  if (!petData || isError) {
    return (
      <>
        <PageHeader text="Pet Details" />
        <div className="flex flex-col min-h-[50vh] p-10 text-center bg-fixed bg-center bg-cover bg-no-repeat bg-[url(/assets/img/wallpaper.jpg)] text-orange-600 shadow-md rounded-lg mx-4">
          <WarningContainer
            header="Pet Not Found"
            text="The pet you're looking for doesn’t exist"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader text="Pet Details" />
      <div className="bg-orange-600">
        <div className="mx-auto rounded-t-xl px-[6%] py-4 bg-fixed bg-center bg-cover bg-no-repeat bg-[url(/assets/img/wallpaper.jpg)] h-full w-full ">
          <div className="flex max-lg:flex-col gap-x-4 ">
            <div className="flex-1 min-w-[50%] justify-center">
              <PetCarousel petData={petData} cleanImageUrl={cleanImageUrl} />
            </div>
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
