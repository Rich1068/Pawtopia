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

export const validateField = (name: string, value: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10,15}$/; // Allows 10-15 digit phone numbers

  let error = "";
  switch (name) {
    case "name":
    case "address":
      if (!value.trim())
        error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
      break;
    case "email":
      if (!value.trim()) error = "Email is required.";
      else if (!emailRegex.test(value)) error = "Invalid email format.";
      break;
    case "phone":
      if (!value.trim()) error = "Phone number is required.";
      else if (!phoneRegex.test(value)) error = "Invalid phone number format.";
      break;
    case "reason":
      if (!value.trim()) error = "Reason for adoption is required.";
      else if (value.length < 10)
        error = "Reason must be at least 10 characters.";
      break;
    case "livingSituation":
    case "experience":
      if (!value)
        error = `Please select your ${name
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()}.`;
      break;
    default:
      break;
  }
  return error;
};

export const validateForm = (
  formData: Record<string, string>
): ValidationErrors => {
  const errors: ValidationErrors = {};
  Object.keys(formData).forEach((key) => {
    const error = validateField(key, formData[key]);
    if (error) errors[key] = error;
  });
  return errors;
};
export default validate;
