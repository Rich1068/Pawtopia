import { useState, useEffect } from "react";
import { Search, Eye, Edit, Trash } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import serverAPI from "../../helper/axios";
import { getFullImageUrl } from "../../helper/imageHelper";
import { Link } from "react-router";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import CategoryFilter from "../../components/shop/Admin/ProductList/CategoryFilter";

interface IProduct {
  images: string[];
  name: string;
  price: number;
  category: string[];
}

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategories.length > 0) {
          params.append("categories", selectedCategories.join(","));
        }

        const response = await serverAPI.get(
          `/product/list?${params.toString()}`,
          {
            withCredentials: true,
          }
        );

        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories]);

  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          <img
            src={getFullImageUrl(row.original.images?.[0])}
            alt="Product"
            className="w-12 h-12 object-cover rounded-md sm:w-16 sm:h-16"
            onError={(e) => (e.currentTarget.src = "/assets/img/Logo1.png")}
          />
        </div>
      ),
    },
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `$${row.original.price}`,
    },
    {
      accessorKey: "categories",
      header: "Categories",
      cell: ({ row }) =>
        row.original.category?.length
          ? row.original.category.join(", ")
          : "No Category",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleView(row.original)}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-700 transition"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700 transition"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleView = (product: IProduct) => {
    console.log("Viewing product:", product);
  };

  const handleEdit = (product: IProduct) => {
    console.log("Editing product:", product);
  };

  const handleDelete = (product: IProduct) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      console.log("Deleting product:", product);
    }
  };

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-9999">
        <LoadingPage fadeOut={false} />
      </div>
    );

  return (
    <div className="relative sm:px-6 font-primary text-amber-950">
      <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-orange-600">
        Product List
      </h2>
      <div className="p-4 sm:p-6 bg-white shadow-xl rounded-xl">
        {/* Search & Filter */}
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

        {/* Table */}
        <div className="overflow-x-auto mt-4 rounded-md border border-orange-300 shadow-md">
          <table className="w-full rounded-md overflow-hidden">
            <thead className="bg-orange-500 text-white text-sm sm:text-xl">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-3 text-center cursor-pointer font-semibold"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" ? " 🔼" : ""}
                      {header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="even:bg-orange-50 odd:bg-white hover:bg-orange-100 text-sm sm:text-base"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="p-3 border-orange-300 text-center last:border-0"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center p-4 text-orange-600"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-row justify-between sm:justify-end items-center mt-4 gap-3">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 sm:w-auto"
          >
            Prev
          </button>
          <span className="text-amber-950">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 sm:w-auto"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
