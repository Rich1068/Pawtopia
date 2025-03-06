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
    <div className="w-64 bg-white p-4 font-secondary font-semibold">
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
  );
};

export default AdoptFilter;
