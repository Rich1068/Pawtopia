import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import ProductFilters from "../../components/shop/Admin/ProductList/ProductFilters";
import ProductActionButtons from "../../components/shop/Admin/ProductList/ProductActionButtons";
import { IProduct } from "../../types/Types";
import { getFullImageUrl } from "../../helper/imageHelper";
import TitleComponent from "../../components/shop/Admin/TitleComponent";
import DataTable from "../../components/HistoryTable/DataTable";
import { useProducts } from "../../hooks/useProducts";

const ProductList = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [data, setData] = useState<IProduct[]>([]);
  const memoizedSelectedCategories = useMemo(
    () => selectedCategories,
    [selectedCategories]
  );
  const memoizedStatusFilter = useMemo(() => statusFilter, [statusFilter]);

  const {
    products,
    isLoading,
    error,
    deleteProduct,
    archiveProduct,
    recoverProduct,
  } = useProducts({
    selectedCategories: memoizedSelectedCategories,
    statusFilter: memoizedStatusFilter,
  });
  const memoProducts = useMemo(() => products ?? [], [products]);
  useEffect(() => {
    setData(memoProducts);
  }, [memoProducts]);
  const handleDeleteProduct = useCallback(async (productId: string) => {
    deleteProduct(productId);
  }, []);
  const handleArchiveProduct = useCallback(async (productId: string) => {
    archiveProduct(productId);
  }, []);

  const handleRecoverProduct = useCallback(async (productId: string) => {
    recoverProduct(productId);
  }, []);
  console.log("ProductList rendered", products.length);
  const columns = useMemo<ColumnDef<IProduct>[]>(
    () => [
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
        enableSorting: true,
      },
      {
        accessorKey: "category",
        header: "Categories",
        cell: ({ row }) =>
          row.original.category?.length
            ? row.original.category.join(", ")
            : "No Category",
        enableSorting: true,
      },
      {
        accessorKey: "isArchived",
        header: "Status",
        cell: ({ row }) => {
          return (
            <span
              className={`px-2 py-1 rounded-md text-white ${
                row.original.isArchived ? "bg-yellow-400" : "bg-green-500"
              }`}
            >
              {row.original.isArchived ? "Archived" : "Active"}
            </span>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ProductActionButtons
            product={row.original}
            onDelete={handleDeleteProduct}
            onArchive={handleArchiveProduct}
            onRecover={handleRecoverProduct}
          />
        ),
      },
    ],
    [handleDeleteProduct, handleArchiveProduct, handleRecoverProduct]
  );

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (error) return <div>Error loading products</div>;
  return (
    <div className="relative font-primary text-amber-950">
      <TitleComponent text="Product List" />
      <div className="p-4 sm:p-6 bg-white shadow-xl rounded-xl">
        <ProductFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          table={table}
        />
        <DataTable table={table} isLoading={isLoading} style="!p-0" />
      </div>
    </div>
  );
};

export default ProductList;
