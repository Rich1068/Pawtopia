import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import serverAPI from "../../helper/axios";

const VerifyEmailSection = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const userEmail = localStorage.getItem("userEmail") || "";
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await serverAPI.get(`/api/auth/verify-email?token=${token}`);
        setVerificationSuccess(true);
        toast.success("Email verified successfully! You can now log in.");
        setTimeout(() => navigate("/login"), 3000);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Invalid or expired token.");
        setIsVerifying(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setIsVerifying(false);
    }
  }, [token, navigate]);

  const handleResendVerification = async () => {
    try {
      await serverAPI.post("/api/auth/resend-verification", {
        email: userEmail,
      });
      toast.success("Verification email sent!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to resend verification email.");
    }
  };

  if (isVerifying) {
    return <p className="text-center">Verifying email...</p>;
  }

  return (
    <div className="relative max-w-md mx-auto p-6 bg-white shadow-lg -mt-20 rounded-xl font-primary">
      {verificationSuccess ? (
        <h2 className="text-center text-green-600">Email Verified!</h2>
      ) : (
        <>
          <h2 className="text-center text-orange-600">Email Verification</h2>
          <p className="text-gray-500 text-center mb-4">
            Please check your email to verify your account.
          </p>
          <button
            onClick={handleResendVerification}
            className="w-full py-2 px-4 bg-orange-600 text-white rounded hover:bg-orange-500"
          >
            Resend Verification Email
          </button>
        </>
      )}
    </div>
  );
};

export default VerifyEmailSection;
