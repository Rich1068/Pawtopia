import { FC, useState } from "react";
import type { PetFilter } from "../../types/Types";
import { ChevronDown, ChevronUp } from "lucide-react";
interface IFilterSection {
  title: string;
  options: string[];
  selected: string[];
  petCounts: Record<string, number>;
  filterType: keyof PetFilter;
  handleCheckboxChange: (filterType: keyof PetFilter, value: string) => void;
}
export const FilterSection: FC<IFilterSection> = ({
  title,
  options,
  selected,
  petCounts,
  filterType,
  handleCheckboxChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-300 py-2">
      {/* Title - Click to Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full font-semibold text-left p-2"
      >
        <span>{title}</span>
        <span
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {/* Filter Options - Show/Hide */}
      {isOpen && (
        <div className="mt-2 space-y-1 pl-2">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleCheckboxChange(filterType, option)}
              />
              <span>
                {option.charAt(0).toUpperCase() + option.slice(1)} (
                {petCounts[option === "x-large" ? "xlarge" : option] || 0})
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
