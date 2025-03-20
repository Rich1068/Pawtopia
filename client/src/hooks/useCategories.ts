import { useEffect, useState } from "react";
import serverAPI from "../helper/axios";

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await serverAPI.get("/product/get-categories");
        setCategories(response.data);
      } catch (error) {
        setError("Failed to fetch categories");
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, setCategories, loading, error };
};
