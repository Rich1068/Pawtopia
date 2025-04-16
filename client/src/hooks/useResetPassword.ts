import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import serverAPI from "../helper/axios";

// API functions
const verifyResetToken = async (token: string) => {
  return serverAPI.get(`/api/reset-password/${token}`);
};

const resetPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  return serverAPI.post(`/api/reset-password/${token}`, { password });
};

export const useResetPassword = (token: string | undefined) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Verify token query
  const tokenQuery = useQuery({
    queryKey: ["reset-token", token],
    queryFn: () => verifyResetToken(token as string),
    enabled: !!token,
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successful! Please log in.");
      navigate("/login");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Something went wrong");
    },
  });

  const validatePasswordAndReset = () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (password.length < 1) {
      toast.error("Password must be at least 1 character");
      return false;
    }

    resetPasswordMutation.mutate({ token: token as string, password });
    return true;
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isVerifying: tokenQuery.isLoading,
    isValidToken: tokenQuery.isSuccess,
    isLoading: resetPasswordMutation.isPending, // Changed to `isLoading` to track mutation progress
    validatePasswordAndReset,
  };
};
