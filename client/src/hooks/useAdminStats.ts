import { useQuery } from "@tanstack/react-query";
import serverAPI from "../helper/axios";

const fetchAdminStats = async () => {
  const response = await serverAPI.get("/admin/stats", {
    withCredentials: true,
  });
  return response.data;
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: fetchAdminStats,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
