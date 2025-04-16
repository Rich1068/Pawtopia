import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import serverAPI from "../helper/axios";

//ForgotPasswordSection.tsx
const forgotPassword = async (email: string) => {
  await serverAPI.post("/api/forgot-password", { email });
};

const useForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Password reset link sent to your email");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Something went wrong, try again"
      );
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    if (!emailCheck.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    setIsLoading(true);
    forgotPasswordMutation.mutate(email); // Pass email to the mutation function
  };

  return {
    email,
    setEmail,
    isLoading,
    handleSubmit,
  };
};

export default useForgotPassword;
