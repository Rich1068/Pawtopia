import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import serverAPI from "../../helper/axios";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import ProductFilters from "../../components/shop/Admin/ProductList/ProductFilters";
import ProductActionButtons from "../../components/shop/Admin/ProductList/ProductActionButtons";
import { IProduct } from "../../types/Types";
import { getFullImageUrl } from "../../helper/imageHelper";
import TitleComponent from "../../components/shop/Admin/TitleComponent";
import DataTable from "../../components/HistoryTable/DataTable";

const ProductList = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategories.length > 0) {
          params.append("categories", selectedCategories.join(","));
        }
        if (statusFilter !== "All") {
          params.append(
            "status",
            statusFilter === "Available" ? "available" : "archived"
          );
        }
        const response = await serverAPI.get(
          `/product/list?${params.toString()}`,
          { withCredentials: true }
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, statusFilter]);

  const handleDeleteProduct = useCallback((productId: string) => {
    //include products that is not the productId from the argument
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p._id !== productId)
    );
  }, []);
  const handleArchiveProduct = useCallback((productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p._id === productId ? { ...p, isArchived: true } : p
      )
    );
  }, []);
  const handleRecoverProduct = useCallback((productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p._id === productId ? { ...p, isArchived: false } : p
      )
    );
  }, []);

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
      },
      {
        accessorKey: "category",
        header: "Categories",
        cell: ({ row }) =>
          row.original.category?.length
            ? row.original.category.join(", ")
            : "No Category",
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
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (loading) return <LoadingPage fadeOut={false} />;

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
        <DataTable table={table} style="!p-0" />
      </div>
    </div>
  );
};

export default ProductList;
