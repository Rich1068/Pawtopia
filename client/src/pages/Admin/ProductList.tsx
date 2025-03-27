import { useState, useEffect } from "react";
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
import ProductTable from "../../components/shop/Admin/ProductList/ProductTable";
import ProductActionButtons from "../../components/shop/Admin/ProductList/ProductActionButtons";
import { IProduct } from "../../types/Types";
import { getFullImageUrl } from "../../helper/imageHelper";
import TitleComponent from "../../components/shop/Admin/TitleComponent";

const ProductList = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
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
      accessorKey: "category",
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
        <ProductActionButtons
          product={row.original}
          onDelete={handleDeleteProduct}
        />
      ),
    },
  ];

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

  const handleDeleteProduct = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p._id !== productId)
    );
  };
  return (
    <div className="relative font-primary text-amber-950">
      <TitleComponent text="Product List" />
      <div className="p-4 sm:p-6 bg-white shadow-xl rounded-xl">
        <ProductFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          table={table}
        />
        <ProductTable table={table} />
      </div>
    </div>
  );
};

export default ProductList;
