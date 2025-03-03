/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useMemo } from "react";
import serverAPI from "../helper/axios";
import Cards from "../components/Adopt/Cards";
import type { petType } from "../types/pet";
import AdoptHeroSection from "../components/Adopt/AdoptHeroSection";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import ReactPaginate from "react-paginate";

const Adopt = () => {
  const [selected, setSelected] = useState<{ dog: boolean; cat: boolean }>({
    dog: true,
    cat: true,
  });

  const [allPets, setAllPets] = useState<petType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const petsPerPage = 25;

  // Fetch pets once
  useEffect(() => {
    serverAPI
      .get("/pet/getAvailablePets")
      .then(({ data }) => {
        setAllPets(data.data);
      })
      .catch((error) => console.error("Error fetching pets:", error))
      .finally(() => setIsLoading(false));
  }, []);

  // Filter pets based on selection
  const filteredPets = useMemo(() => {
    return allPets.filter((pet) => {
      if (!pet.relationships?.species?.data?.length) return false;

      const speciesId = pet.relationships.species.data[0]?.id;
      return (
        (selected.dog && speciesId === "8") ||
        (selected.cat && speciesId === "3")
      );
    });
  }, [selected, allPets]);

  // Update page count and ensure currentPage is valid
  const pageCount = Math.max(Math.ceil(filteredPets.length / petsPerPage), 1);
  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [filteredPets, pageCount]);

  // Compute current page's pets using useMemo() for efficiency
  const currentPets = useMemo(() => {
    const start = (currentPage - 1) * petsPerPage;
    return filteredPets.slice(start, start + petsPerPage);
  }, [filteredPets, currentPage]);

  const handlePageClick = (e: { selected: number }) => {
    setCurrentPage(e.selected + 1); // React-Paginate uses 0-based index
  };

  if (isLoading) return <LoadingPage fadeOut={false} />;

  return (
    <>
      <div className="bg-orange-500 min-h-screen flex flex-col">
        <AdoptHeroSection selected={selected} setSelected={setSelected} />
        <Cards pets={currentPets} />
      </div>
      <ReactPaginate
        forcePage={currentPage - 1}
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"flex justify-center space-x-2 mt-6"}
        activeLinkClassName={"bg-orange-600 text-white"}
        pageLinkClassName={
          "border border-gray-300 px-3 py-1 rounded-md cursor-pointer"
        }
        previousLinkClassName={
          "border border-gray-300 px-3 py-1 rounded-md cursor-pointer"
        }
        nextLinkClassName={
          "border border-gray-300 px-3 py-1 rounded-md cursor-pointer"
        }
        breakLinkClassName={
          "border border-gray-300 px-3 py-1 rounded-md cursor-pointer"
        }
      />
    </>
  );
};

export default Adopt;
