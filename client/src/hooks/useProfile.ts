import { useMutation } from "@tanstack/react-query";
import serverAPI from "../helper/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

//ProfileCard.tsx

export const useUpdateProfile = () => {
  const { verifyToken } = useAuth();
  return useMutation({
    mutationFn: async (updatedData: {
      name: string;
      email: string;
      phoneNumber: string;
    }) => {
      const res = await serverAPI.post("/user/edit", updatedData, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      verifyToken();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data.error || "Something went wrong.");
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (passwordData: {
      password: string;
      confirmPassword: string;
    }) => {
      const res = await serverAPI.post("/user/edit-password", passwordData, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data.error || "Something went wrong.");
    },
  });
};

export const useUploadProfileImage = () => {
  const { verifyToken } = useAuth();

  return useMutation({
    mutationFn: async ({ userId, image }: { userId: string; image: File }) => {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("userId", userId);

      const { data } = await serverAPI.post("/user/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      return data;
    },
    onSuccess: () => {
      toast.success("Profile image updated");
      verifyToken();
    },
    onError: () => {
      toast.error("Failed to upload image");
    },
  });
};
