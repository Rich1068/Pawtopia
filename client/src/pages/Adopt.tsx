/* eslint-disable @typescript-eslint/no-explicit-any */

import serverAPI from "../helper/axios";
import type { petType } from "../types/pet";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import PageHeader from "../components/PageHeader";

import { useQuery } from "@tanstack/react-query";
import AdoptContainer from "../components/Adopt/AdoptContainer";

const fetchPets = async () => {
  try {
    const { data } = await serverAPI.get("/pet/getAvailablePets");
    return data.data as petType[];
  } catch (error) {
    console.log("FetchPets error: ", error);
  }
};

const Adopt = () => {
  const { data: allPets = [], isLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: fetchPets,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingPage fadeOut={false} />;

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <PageHeader text="Adopt List" />
        <div className="flex flex-row">
          <AdoptContainer allPets={allPets} />
        </div>
      </div>
    </>
  );
};

export default Adopt;
