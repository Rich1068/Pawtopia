/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, FC } from "react";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import { useFilteredProducts } from "../../../hooks/useFilteredProducts";
import { usePagination } from "../../../hooks/usePagination";
import ShopCards from "./ShopCards";
import { IProduct } from "../../../types/Types";
import ShopFilter from "./ShopFilter";

const ShopContainer: FC<{ allProducts: IProduct[] }> = ({ allProducts }) => {
  //SELECTED FILTERS
  const [selected, setSelected] = useState<Record<string, string[]>>(() => {
    const storedFilters = localStorage.getItem("selectedFilters");
    return storedFilters ? JSON.parse(storedFilters) : {};
  });
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    localStorage.setItem("selectedFilters", JSON.stringify(selected));
  }, [selected]);

  //custom hooks for filterpets, petcount, and pagination logic
  const { filteredProducts, productCounts } = useFilteredProducts(
    allProducts,
    selected,
    searchQuery
  );
  const {
    currentItems: currentProducts,
    currentPage,
    setCurrentPage,
    pageCount,
  } = usePagination(filteredProducts, 25);

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
          <ShopFilter
            selected={selected}
            setSelected={setSelected}
            productCounts={productCounts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredProducts={filteredProducts}
          />
        </div>
      )}
      <div className="flex flex-row min-h-svh shrink">
        <div className="relative max-md:hidden min-w-50 max-w-64 w-full">
          <ShopFilter
            selected={selected}
            setSelected={setSelected}
            productCounts={productCounts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredProducts={filteredProducts}
          />
        </div>
        <div className=" max-md:-mt-10 w-full">
          <ShopCards
            products={currentProducts}
            header={"No Products Available"}
            text={"Check back later or try selecting different Category."}
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

export default ShopContainer;
