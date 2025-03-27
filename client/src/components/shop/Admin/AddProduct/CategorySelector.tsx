import { useRef, useState } from "react";
import { useCategories } from "../../../../hooks/useCategories";

interface CategorySelectorProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const { categories, setCategories, loading, error } = useCategories();
  const [newCategory, setNewCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCategorySelect = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]); // Add new category to existing list
      handleCategorySelect(newCategory);
      setNewCategory("");
    }
  };

  return (
    <div
      className="relative inline-block text-left w-full mb-2 font-primary text-amber-950"
      ref={dropdownRef}
    >
      <label className="font-primary text-lg text-amber-950">Category</label>
      <div
        className="border my-2 border-gray-300 overflow-y-scroll max-h-30 p-2 rounded-lg bg-white flex flex-wrap gap-2 min-h-[42px] cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {selectedCategories.length > 0 ? (
          selectedCategories.map((category) => (
            <span
              key={category}
              className="bg-orange-400 text-white px-2 py-1 rounded flex items-center"
            >
              {category}
              <button
                type="button"
                className="ml-2 text-white font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCategory(category);
                }}
              >
                ✕
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-400/70">Select or add categories</span>
        )}
        <button type="button" className="ml-auto text-gray-600">
          {dropdownOpen ? "▲" : "▼"}
        </button>
      </div>

      {dropdownOpen && (
        <div className="absolute mt-2 w-full border border-gray-300 bg-white rounded-lg shadow-xl z-10">
          <div className="p-2">
            {loading ? (
              <p className="text-gray-500 text-center">Loading...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : (
              <div className="overflow-y-scroll max-h-60">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className="block w-full hover:bg-orange-100 text-left px-4 py-2 text-gray-700 font-secondary font-semibold rounded cursor-pointer"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category}
                    </button>
                  ))
                ) : (
                  <span className="block text-gray-400 text-center">
                    No Categories
                  </span>
                )}
              </div>
            )}

            {/* Add New Category */}
            <div className="mt-2 p-2">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="Enter new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                type="button"
                className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-400 cursor-pointer font-primary"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
