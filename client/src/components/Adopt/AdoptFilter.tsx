import { FC } from "react";
import { PetCounts, PetFilter } from "../../types/Types";
import FilterSection from "./FilterSection";
import { Search } from "lucide-react";

interface IAdoptFilter {
  selected: PetFilter;
  setSelected: React.Dispatch<React.SetStateAction<PetFilter>>;
  petCounts: PetCounts;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const AdoptFilter: FC<IAdoptFilter> = ({
  selected,
  setSelected,
  petCounts,
  searchQuery,
  setSearchQuery,
}) => {
  // Updates the selected filter
  const handleCheckboxChange = (filterType: keyof PetFilter, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value) // Remove filter if exists
        : [...prev[filterType], value], // Add the filter
    }));
  };
  const filterOptions: {
    title: string;
    options: string[];
    type: keyof PetFilter;
  }[] = [
    { title: "Species", options: ["dog", "cat"], type: "species" },
    {
      title: "Age",
      options: ["baby", "young", "adult", "senior"],
      type: "age",
    },
    {
      title: "Size",
      options: ["small", "medium", "large", "x-large"],
      type: "size",
    },
    { title: "Gender", options: ["male", "female"], type: "gender" },
  ];
  return (
    <>
      <div className=" bg-white min-w-auto m-4 font-secondary font-semibold">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Filters ({petCounts.species.dog + petCounts.species.cat})
          </h2>

          <button
            onClick={() => {
              const defaultFilters = {
                species: ["dog", "cat"],
                age: [],
                size: [],
                gender: [],
              };
              setSearchQuery("");
              setSelected(defaultFilters);
            }}
            className="text-sm text-red-600 underline hover:text-red-700 cursor-pointer"
          >
            Reset
          </button>
        </div>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a pet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 pl-10 rounded-md w-full"
          />
        </div>
        {filterOptions.map(({ title, options, type }) => (
          <FilterSection
            key={type}
            title={title}
            options={options}
            selected={selected[type]}
            petCounts={petCounts[type]}
            filterType={type}
            handleCheckboxChange={handleCheckboxChange}
          />
        ))}
      </div>
    </>
  );
};

export default AdoptFilter;
