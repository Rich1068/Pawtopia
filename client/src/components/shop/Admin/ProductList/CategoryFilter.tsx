import { useEffect, useState, useRef } from "react";
import serverAPI from "../../../../helper/axios";
import { X, ChevronDown } from "lucide-react";

interface CategoryFilterProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await serverAPI.get("/product/get-categories", {
          withCredentials: true,
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div
      className="relative w-full min-w-40 md:max-w-64 font-primary"
      ref={dropdownRef}
    >
      {/* Select Box */}
      <div
        className="flex justify-between p-2 max-h-10.5 overflow-y-scroll border border-orange-400 rounded cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="flex flex-wrap gap-2 w-full ">
          {selectedCategories.length > 0 ? (
            selectedCategories.map((category) => (
              <span
                key={category}
                className="bg-orange-400 text-white px-2 rounded flex items-center"
              >
                {category}
                <button
                  type="button"
                  className="ml-1 text-white font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategorySelect(category);
                  }}
                >
                  <X size={14} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-amber-950/55">Select categories...</span>
          )}
        </div>
        <ChevronDown className="text-orange-500" size={18} />
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute mt-2 w-full border border-orange-400 bg-white rounded shadow-lg z-50 max-h-60 overflow-y-auto">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-orange-100"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategorySelect(category)}
                className="mr-2 accent-orange-500"
              />
              {category}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
