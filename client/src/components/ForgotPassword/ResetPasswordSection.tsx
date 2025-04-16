import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useResetPassword } from "../../hooks/useResetPassword";

const ResetPasswordSection = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isVerifying,
    isValidToken,
    isLoading,
    validatePasswordAndReset,
  } = useResetPassword(token);

  useEffect(() => {
    if (!isValidToken && !isVerifying) {
      toast.error("Invalid or expired token");
      navigate("/forgot-password");
    }
  }, [isValidToken, isVerifying, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validatePasswordAndReset();
  };

  if (isVerifying) return <div>Verifying token...</div>;
  if (!isValidToken) return null;

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
            data-testid="password-input"
          />
        </label>

        <label className="block mb-4">
          <input
            type="password"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            data-testid="confirm-password"
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
