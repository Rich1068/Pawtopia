// hooks/useAdoptionForm.ts
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import serverAPI from "../helper/axios";
import {
  validateField,
  validateForm,
  ValidationErrors,
} from "../helper/validation";

interface UseAdoptionFormProps {
  petId: string;
  petName: string;
  user: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  } | null;
}

export const useAdoptionForm = ({
  petId,
  petName,
  user,
}: UseAdoptionFormProps) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: "",
    livingSituation: "",
    otherLivingSituation: "",
    mode: "",
    otherMode: "",
    experience: "",
    reason: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      serverAPI.post(
        "/adopt/create-request",
        { ...formData, petId, petName },
        { withCredentials: true }
      ),
    onSuccess: () => {
      setSuccessMessage(
        "Your adoption request has been submitted!\nPlease Wait for a message on your mode of communication!"
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        livingSituation: "",
        otherLivingSituation: "",
        mode: "",
        otherMode: "",
        experience: "",
        reason: "",
      });
      setErrors({});
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Something went wrong");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    const validationError = validateField(name, value);
    if (validationError) {
      setErrors((prev) => ({ ...prev, [name]: validationError }));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [name]: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(value !== "Other" && {
        [`other${name.charAt(0).toUpperCase() + name.slice(1)}`]: "",
      }),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    mutation.mutate();
  };

  return {
    formData,
    errors,
    successMessage,
    isSubmitting: mutation.isPending,
    handleChange,
    handleRadioChange,
    handleSubmit,
  };
};
