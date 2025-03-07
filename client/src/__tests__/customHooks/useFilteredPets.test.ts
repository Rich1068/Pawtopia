import { renderHook } from "@testing-library/react";
import { useFilteredPets } from "../../hooks/useFilteredPets";
import { mockPets } from "../../__mocks__/mockPets";
import { PetFilter } from "../../types/Types";

describe("useFilteredPets test", () => {
  it("filter by species", () => {
    const selectedFilters: PetFilter = {
      species: ["dog"],
      age: [],
      size: [],
      gender: [],
    };
    const searchQuery: string = "";
    const { result } = renderHook(() =>
      useFilteredPets(mockPets, selectedFilters, searchQuery)
    );

    expect(result.current.filteredPets).toHaveLength(1);
    expect(result.current.filteredPets[0].id).toBe("10217455"); // Dog id
  });
  it("filters by search query", () => {
    const selectedFilters: PetFilter = {
      species: [],
      age: [],
      size: [],
      gender: [],
    };
    const searchQuery: string = "Kaia Carson";
    const { result } = renderHook(() =>
      useFilteredPets(mockPets, selectedFilters, searchQuery)
    );

    expect(result.current.filteredPets).toHaveLength(1);
    expect(result.current.filteredPets[0].id).toBe("10217455"); // Matches Buddy
  });
});
