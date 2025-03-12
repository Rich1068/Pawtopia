/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, FC } from "react";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { petType } from "../../types/pet";
import AdoptFilter from "./AdoptFilter";
import { PetFilter } from "../../types/Types";
import Cards from "./Cards";
import ReactPaginate from "react-paginate";
import { useFilteredPets } from "../../hooks/useFilteredPets";
import { usePagination } from "../../hooks/usePagination";

interface IAdoptContainer {
  allPets: petType[];
}

const AdoptContainer: FC<IAdoptContainer> = ({ allPets }) => {
  //SELECTED FILTERS
  const [selected, setSelected] = useState<PetFilter>(() => {
    const storedFilters = localStorage.getItem("selectedFilters");
    return storedFilters
      ? JSON.parse(storedFilters)
      : { species: ["dog", "cat"], age: [], size: [], gender: [] };
  });
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("selectedFilters", JSON.stringify(selected));
  }, [selected]);

  //custom hooks for filterpets, petcount, and pagination logic
  const { filteredPets, petCounts } = useFilteredPets(
    allPets,
    selected,
    searchQuery
  );
  const { currentPets, currentPage, setCurrentPage, pageCount } = usePagination(
    filteredPets,
    25
  );

  const handlePageClick = (e: { selected: number }) => {
    setCurrentPage(e.selected + 1); // React-Paginate uses 0-based index
  };

  const cleanImageUrl = (url: string | undefined): string | undefined => {
    let cleanedUrl = url?.split("?")[0];
    cleanedUrl = cleanedUrl?.replace(/\/\d+(?=\.\w+$)/, "");
    cleanedUrl = cleanedUrl?.replace(/\.\w+$/, "");
    return cleanedUrl;
  };

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className=" h-full w-full bottom-0 px-[8%]">
      {/* Mobile Filter Button */}
      <button
        className="md:hidden ml-auto bg-orange-600 text-white px-4 my-4 py-2 rounded-lg shadow-md flex items-center space-x-2"
        onClick={toggleFilter}
      >
        <FontAwesomeIcon icon={faFilter} />
        <span>Filters</span>
      </button>
      {/* Mobile Filter Dropdown */}
      {isOpen && (
        <div className="absolute right-2 md:hidden bg-white shadow-lg p-4 rounded-lg z-50 w-64">
          <button
            className="absolute top-2 right-2 text-gray-600"
            onClick={toggleFilter}
          >
            ✖
          </button>
          <div className="-ml-4">
            <AdoptFilter
              selected={selected}
              setSelected={setSelected}
              petCounts={petCounts}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>
      )}
      <div className="flex flex-row min-h-svh shrink">
        <div className="relative max-md:hidden min-w-50 max-w-64 w-full">
          <AdoptFilter
            selected={selected}
            setSelected={setSelected}
            petCounts={petCounts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <div className="flex max-md:-mt-10">
          <Cards
            pets={currentPets}
            cleanImageUrl={cleanImageUrl}
            header={"No Pets Available"}
            text={"Check back later or try selecting different filters."}
          />
        </div>
      </div>
      <div className="pb-5">
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
      </div>
    </div>
  );
};

export default AdoptContainer;
