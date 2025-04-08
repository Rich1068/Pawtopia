import { useQuery } from "@tanstack/react-query";
import serverAPI from "../helper/axios";
import { IAdoptRequest, IOrder } from "../types/Types";

//Dashboard Card
export const useAdminStats = () => {
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const { data } = await serverAPI.get("/admin/stats", {
        withCredentials: true,
      });
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

//Dashboard Charts
export const useAdoptionStats = () => {
  return useQuery({
    queryKey: ["adoptionStats"],
    queryFn: async () => {
      const { data } = await serverAPI.get("/admin/adoptions-per-month", {
        withCredentials: true,
      });
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

export const useMostSoldProducts = () => {
  return useQuery({
    queryKey: ["mostSoldProducts"],
    queryFn: async () => {
      const { data } = await serverAPI.get("/admin/most-sold-products", {
        withCredentials: true,
      });
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

export const useEarningsStats = () => {
  return useQuery({
    queryKey: ["earningsStats"],
    queryFn: async () => {
      const { data } = await serverAPI.get("/admin/earnings-per-month", {
        withCredentials: true,
      });
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

//Dashboard Tables
export const usePendingRequests = () => {
  return useQuery<IAdoptRequest[]>({
    queryKey: ["pending-requests"],
    queryFn: async () => {
      const { data } = await serverAPI.get("/admin/pending-requests", {
        withCredentials: true,
      });
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

export const useRecentOrders = () => {
  return useQuery<IOrder[]>({
    queryKey: ["recent-orders"],
    queryFn: async () => {
      const { data } = await serverAPI.get("/admin/recent-orders", {
        withCredentials: true,
      });
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};
