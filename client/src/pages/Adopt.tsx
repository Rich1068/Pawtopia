/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useMemo } from "react";
import serverAPI from "../helper/axios";
import Cards from "../components/Adopt/Cards";
import type { petType } from "../types/pet";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import ReactPaginate from "react-paginate";
import PageHeader from "../components/PageHeader";
import { PetFilter } from "../types/Types";
import { useQuery } from "@tanstack/react-query";

const fetchPets = async () => {
  try {
    const { data } = await serverAPI.get("/pet/getAvailablePets");
    return data.data as petType[];
  } catch (error) {
    console.log("FetchPets error: ", error);
  }
};

const Adopt = () => {
  //SELECTED FILTERS
  const [selected, setSelected] = useState<PetFilter>({
    species: ["dog", "cat"],
    age: [],
    size: [],
    gender: [],
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const petsPerPage = 25;

  //tanstack Query
  const { data: allPets = [], isLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: fetchPets,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Filter pets based on selection
  const filteredPets = useMemo(() => {
    return allPets.filter((pet) => {
      const speciesId = pet.relationships.species.data[0]?.id;
      const petAge = pet.attributes.ageGroup?.toLowerCase() ?? "";
      const petSize = pet.attributes.sizeGroup?.toLowerCase() ?? "";
      const petGender = pet.attributes.sex?.toLowerCase() ?? "";

      const matchesSpecies =
        selected.species.length === 0 ||
        (selected.species.includes("dog") && speciesId === "8") ||
        (selected.species.includes("cat") && speciesId === "3");

      const matchesAge =
        selected.age.length === 0 || selected.age.includes(petAge);

      const matchesSize =
        selected.size.length === 0 || selected.size.includes(petSize);

      const matchesGender =
        selected.gender.length === 0 || selected.gender.includes(petGender);

      return matchesSpecies && matchesAge && matchesSize && matchesGender;
    });
  }, [selected, allPets]);

  //Count of the pets with the attribute
  const petCounts = useMemo(() => {
    const counts = {
      species: { dog: 0, cat: 0 },
      age: { young: 0, adult: 0, senior: 0, baby: 0 },
      size: { small: 0, medium: 0, large: 0, xlarge: 0 },
      gender: { male: 0, female: 0 },
    };

    filteredPets.forEach((pet) => {
      const speciesId = pet.relationships?.species?.data?.[0]?.id;
      if (speciesId === "8") counts.species.dog++;
      if (speciesId === "3") counts.species.cat++;

      const ageGroup = pet.attributes?.ageGroup;
      if (ageGroup === "Young") counts.age.young++;
      if (ageGroup === "Adult") counts.age.adult++;
      if (ageGroup === "Senior") counts.age.senior++;
      if (ageGroup === "Baby") counts.age.baby++;

      const sizeGroup = pet.attributes?.sizeGroup;
      if (sizeGroup === "Small") counts.size.small++;
      if (sizeGroup === "Medium") counts.size.medium++;
      if (sizeGroup === "Large") counts.size.large++;
      if (sizeGroup === "X-Large") counts.size.xlarge++;

      const gender = pet.attributes?.sex;
      if (gender === "Male") counts.gender.male++;
      if (gender === "Female") counts.gender.female++;

      console.log("Size Group:", sizeGroup);
    });

    return counts;
  }, [filteredPets]);

  // Update page count and ensure currentPage is valid
  const pageCount = Math.max(Math.ceil(filteredPets.length / petsPerPage), 1);
  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [filteredPets, pageCount]);

  // Compute current page's pets
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
      <div className="min-h-screen flex flex-col">
        <PageHeader text="Adopt List" />
        <div className="flex flex-row">
          <Cards
            pets={currentPets}
            selected={selected}
            setSelected={setSelected}
            petCounts={petCounts}
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
    </>
  );
};

export default Adopt;
