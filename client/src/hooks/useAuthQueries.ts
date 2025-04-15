// hooks/useRegisterMutation.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import serverAPI from "../helper/axios";

type RegisterPayload = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: RegisterPayload) => {
      const { data } = await serverAPI.post("/register", values);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Registered Successfully, Please Verify Your Email");
      localStorage.setItem("unverifiedEmail", data.email);
      navigate("/verify-email");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Something went wrong, please try again."
      );
    },
  });
};

interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}
export const useLoginMutation = (login: (rememberMe: boolean) => void) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await serverAPI.post("/login", payload, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: async (data) => {
      login(data.rememberMe);
      if (data.message === "Please Verify Email") {
        localStorage.setItem("unverifiedEmail", data.email);
        navigate("/verify-email");
      } else {
        navigate("/");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Something went wrong");
    },
  });
};
