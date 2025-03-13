import { useState, useEffect, useMemo } from "react";
import { petType } from "../types/pet";

export const usePagination = (filteredPets: petType[], petsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.max(Math.ceil(filteredPets.length / petsPerPage), 1);

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [filteredPets, pageCount]);

  const currentPets = useMemo(() => {
    const start = (currentPage - 1) * petsPerPage;
    return filteredPets.slice(start, start + petsPerPage);
  }, [filteredPets, currentPage, petsPerPage]);

  return { currentPets, currentPage, setCurrentPage, pageCount };
};
