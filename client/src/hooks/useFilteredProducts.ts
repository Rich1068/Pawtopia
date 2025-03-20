import { useMemo } from "react";
import { IProduct } from "../types/Types";
import { useCategories } from "./useCategories";

type FilterState = Record<string, string[]>;

export const useFilteredProducts = (
  allProducts: IProduct[],
  selectedFilters: FilterState,
  searchQuery: string
) => {
  const { categories } = useCategories(); // Fetch all available categories

  return useMemo(() => {
    const lowerCaseSearch = searchQuery.toLowerCase().trim();

    // Step 1: Filter products first
    const filteredProducts = allProducts.filter((product) => {
      const productName = product.name?.toLowerCase() || "";
      const productCategories = product.category || []; // Categories are stored as an array

      // Check if product matches search query
      const matchesSearch =
        !lowerCaseSearch ||
        productName.includes(lowerCaseSearch) ||
        productCategories.some((cat) =>
          cat.toLowerCase().includes(lowerCaseSearch)
        );

      // Check if product matches selected category filters
      const matchesFilters =
        selectedFilters.category.length === 0 ||
        productCategories.some((cat) => selectedFilters.category.includes(cat));

      return matchesSearch && matchesFilters;
    });

    // Step 2: Recalculate productCounts based on filtered results
    const productCounts: Record<string, number> = categories.reduce(
      (acc, category) => ({ ...acc, [category]: 0 }),
      {}
    );

    filteredProducts.forEach((product) => {
      product.category?.forEach((cat) => {
        if (productCounts[cat] !== undefined) {
          productCounts[cat] += 1;
        }
      });
    });

    return { filteredProducts, productCounts };
  }, [allProducts, selectedFilters, searchQuery, categories]);
};
