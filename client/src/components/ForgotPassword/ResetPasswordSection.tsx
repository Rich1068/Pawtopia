import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import serverAPI from "../../helper/axios";

const ResetPasswordSection = () => {
  const { token } = useParams(); // Get the token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  // Verify token when component mounts
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await serverAPI.get(`/api/reset-password/${token}`);
        setIsValidToken(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error);
        toast.error("Invalid or expired token");
        navigate("/forgot-password"); // Redirect to forgot password
      }
    };
    verifyToken();
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 1) {
      toast.error("Password must be at least 1 characters");
      return;
    }

    setIsLoading(true);
    try {
      await serverAPI.post(`/api/reset-password/${token}`, { password });
      toast.success("Password reset successful! Please log in.");
      navigate("/login"); // Redirect to login
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) return null; // Prevent showing form if token is invalid

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg -mt-20 rounded-xl">
      <h2 className="text-2xl font-semibold text-center text-orange-600 mb-4 font-primary">
        Reset Password
      </h2>
      <p className="text-gray-500 text-center mb-6">
        Enter a new password below.
      </p>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <input
            type="password"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          <input
            type="password"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded hover:bg-orange-500 transition"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordSection;
