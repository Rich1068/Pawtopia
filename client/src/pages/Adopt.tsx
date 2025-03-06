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
  const { filteredPets, petCounts } = useMemo(() => {
    //counter
    const counts = {
      species: { dog: 0, cat: 0 },
      age: { baby: 0, young: 0, adult: 0, senior: 0 },
      size: { small: 0, medium: 0, large: 0, xlarge: 0 },
      gender: { male: 0, female: 0 },
    };

    //Mapping of filters
    const speciesMap = { "8": "dog", "3": "cat" } as const;
    const ageMap = {
      Baby: "baby",
      Young: "young",
      Adult: "adult",
      Senior: "senior",
    } as const;
    const sizeMap = {
      Small: "small",
      Medium: "medium",
      Large: "large",
      "X-Large": "xlarge",
    } as const;
    const genderMap = { Male: "male", Female: "female" } as const;

    const filtered = allPets.reduce<petType[]>((acc, pet) => {
      const { relationships, attributes } = pet;

      // Get pet properties
      const speciesId = relationships?.species?.data?.[0]?.id;
      const petAge = attributes?.ageGroup;
      const petSize = attributes?.sizeGroup;
      const petGender = attributes?.sex;

      // Check if pet matches selected filters
      const matchesSpecies =
        !selected.species.length ||
        (selected.species.includes("dog") && speciesId === "8") ||
        (selected.species.includes("cat") && speciesId === "3");
      const matchesAge =
        !selected.age.length ||
        (petAge && selected.age.includes(petAge.toLowerCase()));
      const matchesSize =
        !selected.size.length ||
        (petSize && selected.size.includes(petSize.toLowerCase()));
      const matchesGender =
        !selected.gender.length ||
        (petGender && selected.gender.includes(petGender.toLowerCase()));

      //update count if the pet matches
      if (matchesSpecies && matchesAge && matchesSize && matchesGender) {
        if (speciesId && speciesMap[speciesId as keyof typeof speciesMap]) {
          counts.species[speciesMap[speciesId as keyof typeof speciesMap]]++;
        }
        if (petAge && ageMap[petAge]) counts.age[ageMap[petAge]]++;
        if (petSize && sizeMap[petSize]) counts.size[sizeMap[petSize]]++;
        if (petGender && genderMap[petGender])
          counts.gender[genderMap[petGender]]++;

        acc.push(pet); //Add pet to the filtered lists
      }

      return acc;
    }, []);

    return { filteredPets: filtered, petCounts: counts };
  }, [selected, allPets]);

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
