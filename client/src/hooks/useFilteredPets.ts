import { useMemo } from "react";
import { petType } from "../types/pet";
import { PetFilter } from "../types/Types";

export const useFilteredPets = (
  allPets: petType[],
  selected: PetFilter,
  searchQuery: string
) => {
  return useMemo(() => {
    // Mapping definitions
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

    // Initialize counts
    const petCounts = {
      species: { dog: 0, cat: 0 },
      age: { baby: 0, young: 0, adult: 0, senior: 0 },
      size: { small: 0, medium: 0, large: 0, xlarge: 0 },
      gender: { male: 0, female: 0 },
    };

    // Reduce: Filter pets and count matches in one pass
    const filteredPets = allPets.reduce<petType[]>((acc, pet) => {
      const { relationships, attributes } = pet;
      const speciesId = relationships?.species?.data?.[0]?.id;
      const petAge = attributes?.ageGroup;
      const petSize = attributes?.sizeGroup;
      const petGender = attributes?.sex;

      const searchField = attributes?.searchString?.toLowerCase() || "";
      const matchesSearch = searchField.includes(searchQuery.toLowerCase());

      const mappedSpecies =
        speciesId && speciesId in speciesMap
          ? speciesMap[speciesId as keyof typeof speciesMap]
          : undefined;
      const mappedAge = petAge ? ageMap[petAge] : undefined;
      const mappedSize = petSize ? sizeMap[petSize] : undefined;
      const mappedGender = petGender ? genderMap[petGender] : undefined;

      const matchesFilter = (selectedFilter: string[], petValue?: string) =>
        !selectedFilter.length ||
        (petValue && selectedFilter.includes(petValue));

      if (
        matchesFilter(selected.species, mappedSpecies) &&
        matchesFilter(selected.age, mappedAge) &&
        matchesFilter(selected.size, mappedSize) &&
        matchesFilter(selected.gender, mappedGender) &&
        matchesSearch
      ) {
        if (mappedSpecies) petCounts.species[mappedSpecies]++;
        if (mappedAge) petCounts.age[mappedAge]++;
        if (mappedSize) petCounts.size[mappedSize]++;
        if (mappedGender) petCounts.gender[mappedGender]++;

        acc.push(pet); // Add to filtered list
      }

      return acc;
    }, []);

    return { filteredPets, petCounts };
  }, [selected, allPets, searchQuery]);
};
