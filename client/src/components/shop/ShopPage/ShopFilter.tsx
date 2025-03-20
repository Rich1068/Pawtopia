import { FC } from "react";
import { Search } from "lucide-react";
import ProductFilterSection from "./ProductFilterSection";
import { useCategories } from "../../../hooks/useCategories";
import { IProduct } from "../../../types/Types";

interface ProductFilterProps {
  selected: Record<string, string[]>; // Dynamic filters (category-based)
  setSelected: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  productCounts: Record<string, number>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredProducts: IProduct[];
}

const ShopFilter: FC<ProductFilterProps> = ({
  selected,
  setSelected,
  productCounts,
  searchQuery,
  setSearchQuery,
  filteredProducts,
}) => {
  const { categories } = useCategories();
  // Updates the selected filters dynamically
  const handleCheckboxChange = (filterType: string, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [filterType]: prev[filterType]?.includes(value)
        ? prev[filterType].filter((item) => item !== value) // Remove if exists
        : [...(prev[filterType] || []), value], // Add filter
    }));
  };

  return (
    <div className="mt-9 min-w-auto m-4 font-secondary font-semibold">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Filters ({filteredProducts.length})
        </h2>
        <button
          onClick={() => {
            setSearchQuery("");
            setSelected({ category: [] }); // Reset only category filter
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
          placeholder="Search for a product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 pl-10 rounded-md w-full"
        />
      </div>

      {/* Category Filter Section */}
      <ProductFilterSection
        key="category"
        title="Category"
        options={categories}
        selected={selected.category || []}
        productCounts={productCounts}
        filterType="category"
        handleCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
};

export default ShopFilter;
