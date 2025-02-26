import toast from "react-hot-toast";

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
    if (!password || !confirmPassword) {
      toast.error("Password and Confirm Password are required");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
  }

  return true;
};

export default validate;
