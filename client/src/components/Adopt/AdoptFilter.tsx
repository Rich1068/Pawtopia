import { FC } from "react";
import { PetCounts, PetFilter } from "../../types/Types";
import { FilterSection } from "./FilterSection";

interface IAdoptFilter {
  selected: PetFilter;
  setSelected: React.Dispatch<React.SetStateAction<PetFilter>>;
  petCounts: PetCounts;
}

export const AdoptFilter: FC<IAdoptFilter> = ({
  selected,
  setSelected,
  petCounts,
}) => {
  //Updates the selected filter
  const handleCheckboxChange = (
    filterType: keyof typeof selected,
    value: string
  ) => {
    setSelected((prev) => ({
      ...prev, //current filter
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value) //remove filter if exists
        : [...prev[filterType], value], //add the filter
    }));
  };

  return (
    <div className="w-64 bg-white p-4 font-secondary font-semibold">
      <FilterSection
        title="Species"
        options={["dog", "cat"]}
        selected={selected.species}
        petCounts={petCounts.species}
        filterType="species"
        handleCheckboxChange={handleCheckboxChange}
      />
      <FilterSection
        title="Age"
        options={["baby", "young", "adult", "senior"]}
        selected={selected.age}
        petCounts={petCounts.age}
        filterType="age"
        handleCheckboxChange={handleCheckboxChange}
      />
      <FilterSection
        title="Size"
        options={["small", "medium", "large", "x-large"]}
        selected={selected.size}
        petCounts={petCounts.size}
        filterType="size"
        handleCheckboxChange={handleCheckboxChange}
      />
      <FilterSection
        title="Gender"
        options={["male", "female"]}
        selected={selected.gender}
        petCounts={petCounts.gender}
        filterType="gender"
        handleCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
};

export default AdoptFilter;
