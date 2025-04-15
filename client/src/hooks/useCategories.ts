// hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import serverAPI from "../helper/axios";

const fetchCategories = async (): Promise<string[]> => {
  const { data } = await serverAPI.get("/product/get-categories");
  return data;
};

export const useCategories = () => {
  const {
    data: categories = [],
    isLoading: loading,
    isError,
    refetch,
  } = useQuery<string[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  return {
    categories,
    loading,
    error: isError ? "Failed to fetch categories" : null,
    refetch,
  };
};
