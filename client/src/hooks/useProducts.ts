import { keepPreviousData, useQuery } from "@tanstack/react-query";
import serverAPI from "../helper/axios";
import { IProduct } from "../types/Types";

interface IUseProducts {
  selectedCategories: string[];
  statusFilter: string;
}

const fetchProducts = async ({
  selectedCategories,
  statusFilter,
}: IUseProducts) => {
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

  const response = await serverAPI.get(`/product/list?${params.toString()}`, {
    withCredentials: true,
  });
  return response.data.data; // Return the product data
};

export const useProducts = (
  selectedCategories: string[] = [],
  statusFilter: string = "All"
) => {
  return useQuery<IProduct[], Error>({
    queryKey: ["products", selectedCategories, statusFilter],
    queryFn: async () => {
      return await fetchProducts({ selectedCategories, statusFilter });
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
