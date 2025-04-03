import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router"; // Ensure correct import
import serverAPI from "../helper/axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Please verify your email.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendSuccess, setResendSuccess] = useState("");
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  // Automatically verify email when token is present
  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await serverAPI.get(
          `/api/verify-email?token=${token}`
        );
        setMessage(response.data.message);
        localStorage.removeItem("unverifiedEmail");
        setVerified(true);
        setError("");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.response.data.error);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  // Resend verification email
  const handleResend = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await serverAPI.post("/api/resend-verification", {
        email: localStorage.getItem("unverifiedEmail"),
      });
      setResendSuccess(response.data.message);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-35 px-6 font-secondary">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
        <h2
          className="text-xl font-bold text-gray-700"
          dangerouslySetInnerHTML={{ __html: message }}
        ></h2>

        {verified ? (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 w-full px-4 py-2 bg-orange-500 text-white rounded-md"
          >
            Go to Login
          </button>
        ) : !token ? (
          <>
            <p className="text-gray-500 mt-4" data-testid="p-body">
              We’ve sent a verification email. Didn’t receive it?
            </p>
            <button
              onClick={handleResend}
              disabled={loading}
              className="mt-4 w-full px-4 py-2 bg-orange-500 text-white rounded-md"
            >
              {loading ? "Resending..." : "Resend Email"}
            </button>
            {resendSuccess && (
              <p className="text-green-600 mt-2">{resendSuccess}</p>
            )}
          </>
        ) : null}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
