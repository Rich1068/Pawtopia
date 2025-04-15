import { useQuery } from "@tanstack/react-query";
import serverAPI from "../helper/axios";
import type { IOrder } from "../types/Types";

const fetchOrderCheckout = async (sessionId: string): Promise<IOrder> => {
  const { data } = await serverAPI.get(`/order/success/${sessionId}`);
  return data;
};

export const useOrderCheckout = (sessionId: string | null) => {
  return useQuery<IOrder>({
    queryKey: ["order", sessionId],
    queryFn: () => fetchOrderCheckout(sessionId!),
    enabled: !!sessionId,
    retry: 1,
  });
};
