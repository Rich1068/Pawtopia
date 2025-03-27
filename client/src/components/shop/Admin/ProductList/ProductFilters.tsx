import { Search } from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import { Link } from "react-router";
import { Table } from "@tanstack/react-table";
import type { IProduct } from "../../../../types/Types";

interface ProductFiltersProps {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  table: Table<IProduct>;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  globalFilter,
  setGlobalFilter,
  selectedCategories,
  setSelectedCategories,
  table,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex w-full sm:w-auto gap-3">
        <select
          className="p-2 border border-orange-400 rounded font-primary text-amber-950 w-full sm:w-auto"
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>

        <div className="relative w-7/1 flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />

          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="pl-10 p-2 border border-orange-400 rounded w-full focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="flex-grow relative">
        <CategoryFilter
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </div>

      <Link to="/admin/add-product" className="w-full md:w-auto md:ml-auto">
        <button className="w-full md:w-auto px-4 py-2 border border-orange-500 rounded-lg text-orange-500 hover:bg-orange-500 hover:text-white transition">
          + Add New Product
        </button>
      </Link>
    </div>
  );
};

export default ProductFilters;
