import toast from "react-hot-toast";

const passwordCheck = (
  password: string | undefined,
  confirmPassword: string | undefined
): boolean => {
  if (!password || !confirmPassword) {
    toast.error("Password and Confirm Password are required");
    return false;
  }
  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }
  return true;
};

export const validate = (
  name: string,
  email: string,
  phoneNumber: string,
  password?: string,
  confirmPassword?: string,
  isRegister: boolean = false
): boolean => {
  const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneCheck = /^\d{11}$/;

  if (!name || !email || !phoneNumber) {
    toast.error("All fields are required");
    return false;
  }

  if (!emailCheck.test(email)) {
    toast.error("Invalid email format");
    return false;
  }

  if (!phoneCheck.test(phoneNumber)) {
    toast.error("Invalid phone number format");
    return false;
  }

  if (isRegister) {
    const passwordCheckResult = passwordCheck(password, confirmPassword);
    if (passwordCheckResult === false) {
      return false;
    }
  }
  return true;
};

export const validatePassword = (password: string, confirmPassword: string) => {
  return passwordCheck(password, confirmPassword);
};

export interface ValidationErrors {
  [key: string]: string;
}

export const validateField = (
  name: string,
  value: string,
  formData?: Record<string, string>
): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{11}$/;

  const fieldNames: Record<string, string> = {
    mode: "mode of communication",
    livingSituation: "living situation",
    experience: "experience",
    otherMode: "other mode of communication",
    otherLivingSituation: "other living situation",
  };
  const displayName =
    fieldNames[name] || name.replace(/([A-Z])/g, " $1").toLowerCase();

  if (!value.trim()) {
    if (name === "otherMode") {
      if (formData?.mode !== "Other") return "";
      return "Please specify your mode of communication.";
    }

    if (name === "otherLivingSituation") {
      if (formData?.livingSituation !== "Other") return "";
      return "Please specify your living situation.";
    }

    return `${
      displayName.charAt(0).toUpperCase() + displayName.slice(1)
    } is required.`;
  }

  switch (name) {
    case "email":
      if (!emailRegex.test(value)) return "Invalid email format.";
      break;
    case "phone":
      if (!phoneRegex.test(value)) return "Invalid phone number format.";
      break;
    case "reason":
      if (value.length < 10) return "Reason must be at least 10 characters.";
      break;
    case "experience":
      if (!value) return `Please select your ${displayName}.`;
      break;
  }

  return "";
};

export const validateForm = (
  formData: Record<string, string>
): ValidationErrors => {
  const errors: ValidationErrors = {};
  Object.keys(formData).forEach((key) => {
    const error = validateField(key, formData[key], formData);
    if (error) errors[key] = error;
  });
  return errors;
};
export default validate;
