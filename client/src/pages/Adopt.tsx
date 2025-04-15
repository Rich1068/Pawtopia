/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingPage from "../components/LoadingPage/LoadingPage";
import PageHeader from "../components/PageHeader";
import AdoptContainer from "../components/Adopt/AdoptContainer";
import { useAllPets } from "../hooks/usePets";

const Adopt = () => {
  const { data: allPets = [], isLoading } = useAllPets();

  if (isLoading) return <LoadingPage fadeOut={false} />;

  return (
    <>
      <div className="min-h-screen flex flex-col bg-orange-600">
        <PageHeader text="Adopt List" />
        <div className="flex flex-row rounded-t-xl bg-white">
          <AdoptContainer allPets={allPets} />
        </div>
      </div>
    </>
  );
};

export default Adopt;
