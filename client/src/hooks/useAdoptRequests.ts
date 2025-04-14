import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import serverAPI from "../helper/axios";
import { IAdoptRequest } from "../types/Types";
import toast from "react-hot-toast";

// AllAdoptRequest.tsx
export const useAllAdoptRequests = (
  status: "pending" | "approved" | "rejected"
) => {
  return useQuery<IAdoptRequest[]>({
    queryKey: ["adoptRequests", status],
    queryFn: async () => {
      const { data } = await serverAPI.get("/adopt/requests", {
        params: { status },
        withCredentials: true,
      });
      return data;
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};

export const useAdoptRequestAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string;
      action: "approve" | "reject";
    }) => {
      return await serverAPI.put(
        `/adopt/${id}/${action}`,
        {},
        { withCredentials: true }
      );
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Adopt Request ${
          variables.action === "approve" ? "Approved" : "Rejected"
        }`
      );
      // Refetch data
      queryClient.invalidateQueries({ queryKey: ["adoptRequests"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Something went wrong");
    },
  });
};

//------------------------------------------------------------------------

export const useAdoptRequestHistory = () => {
  return useQuery<IAdoptRequest[]>({
    queryKey: ["adoptRequestHistory"],
    queryFn: async () => {
      const { data } = await serverAPI.get("/adopt/history", {
        withCredentials: true,
      });
      return data;
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
