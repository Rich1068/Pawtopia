import { useMutation, useQuery } from "@tanstack/react-query";
import serverAPI from "../helper/axios";

//VerifyEmail.tsx
export const useVerifyEmailQuery = (token: string | null) => {
  return useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: async () => {
      const { data } = await serverAPI.get(`/api/verify-email?token=${token}`);
      return data;
    },
    enabled: !!token,
    retry: false,
  });
};

export const useResendVerificationMutation = () => {
  return useMutation({
    mutationFn: async (email: string | null) => {
      const { data } = await serverAPI.post("/api/resend-verification", {
        email,
      });
      return data;
    },
  });
};
