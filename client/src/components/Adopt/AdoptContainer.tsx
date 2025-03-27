/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, FC } from "react";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { petType } from "../../types/pet";
import AdoptFilter from "./AdoptFilter";
import { PetFilter } from "../../types/Types";
import ReactPaginate from "react-paginate";
import { useFilteredPets } from "../../hooks/useFilteredPets";
import { usePagination } from "../../hooks/usePagination";
import AdoptCards from "./AdoptCards";

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

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="h-full w-full bottom-0 px-[6%] bg-fixed bg-center bg-cover bg-no-repeat bg-[url(/assets/img/wallpaper.jpg)] rounded-t-xl">
      {/* Mobile Filter Button */}
      <button
        className="relative md:hidden ml-auto bg-orange-600 text-white px-4 my-4 py-2 rounded-lg shadow-md flex items-center space-x-2 z-50"
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
          <AdoptFilter
            selected={selected}
            setSelected={setSelected}
            petCounts={petCounts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
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
        <div className=" max-md:-mt-10 w-full">
          <AdoptCards
            pets={currentPets}
            header={"No Pets Available"}
            text={"Check back later or try selecting different filters."}
          />
        </div>
      </div>
      <div className="pb-7">
        <ReactPaginate
          forcePage={currentPage - 1}
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center space-x-2 mt-8"}
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
