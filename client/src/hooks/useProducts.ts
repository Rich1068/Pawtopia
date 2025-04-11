import { useState, useEffect } from "react";
import serverAPI from "../helper/axios";
import { IProduct } from "../types/Types";

export const useProducts = (
  selectedCategories: string[] = [],
  statusFilter: string = "All"
) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (selectedCategories.length > 0) {
          params.append("categories", selectedCategories.join(","));
        }

        if (statusFilter !== "All") {
          params.append(
            "status",
            statusFilter === "Available" ? "active" : "archived"
          );
        }

        console.log("Fetching products with filters:", {
          selectedCategories,
          statusFilter,
        });

        const response = await serverAPI.get(
          `/product/list?${params.toString()}`,
          { withCredentials: true }
        );

        console.log("Server response:", response.data.data);
        setProducts(response.data.data);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, statusFilter]);

  const deleteProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      await serverAPI.delete(`/product/${productId}`, {
        withCredentials: true,
      });
      console.log(`Product ${productId} deleted successfully.`);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (err: any) {
      console.error(`Error deleting product ${productId}:`, err);
      setError(err.message || "An error occurred while deleting the product.");
    } finally {
      setIsLoading(false);
    }
  };

  const archiveProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      await serverAPI.patch(
        `/product/${productId}/soft-delete`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(`Product ${productId} archived successfully.`);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, isArchived: true } : product
        )
      );
    } catch (err: any) {
      console.error(`Error archiving product ${productId}:`, err);
      setError(err.message || "An error occurred while archiving the product.");
    } finally {
      setIsLoading(false);
    }
  };

  const recoverProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      await serverAPI.patch(
        `/product/${productId}/recover`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(`Product ${productId} recovered successfully.`);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, isArchived: false }
            : product
        )
      );
    } catch (err: any) {
      console.error(`Error recovering product ${productId}:`, err);
      setError(
        err.message || "An error occurred while recovering the product."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    isLoading,
    error,
    deleteProduct,
    archiveProduct,
    recoverProduct,
  };
};
