import { useState } from "react";
import toast from "react-hot-toast";
import serverAPI from "../../helper/axios";

const ForgotPasswordSection = () => {
  const [email, setEmail] = useState<string>("");
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    if (email && !emailCheck.test(email)) {
      toast.error("Invalid email format");
      return;
    }
    setIsLoading(true);
    try {
      await serverAPI.post("/api/forgot-password", { email });
      toast.success("Password reset link sent to your email");
      setEmail("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Something went wrong, try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg -mt-20 rounded-xl">
      <h2 className="text-2xl font-semibold text-center text-orange-600 mb-4 font-primary">
        Forgot Password
      </h2>
      <p className="text-gray-500 text-center mb-6 font-secondary">
        Enter your email to receive a reset link
      </p>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <input
            type="email"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded hover:bg-orange-500 transition"
          disabled={isloading}
        >
          {isloading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordSection;
