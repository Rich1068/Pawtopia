import { useQuery } from "@tanstack/react-query";
import serverAPI from "../helper/axios";
import { IOrder } from "../types/Types";

//AdminOrderHistory.tsx
export const useAdminOrderHistory = () => {
  return useQuery<IOrder[]>({
    queryKey: ["adminOrderHistory"],
    queryFn: async (): Promise<IOrder[]> => {
      const { data } = await serverAPI.get("/order/all", {
        withCredentials: true,
      });
      return data;
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
//---------------------------------------------------

export const useOrderHistory = () => {
  return useQuery<IOrder[]>({
    queryKey: ["orderHistory"],
    queryFn: async (): Promise<IOrder[]> => {
      const { data } = await serverAPI.get("/order/history", {
        withCredentials: true,
      });
      return data;
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
