/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams, useNavigate } from "react-router";
import { useState } from "react";
import {
  useResendVerificationMutation,
  useVerifyEmailQuery,
} from "../hooks/useVerifyEmail";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [resendSuccess, setResendSuccess] = useState("");

  const {
    data,
    isLoading: verifying,
    isError,
    error,
    isSuccess,
  } = useVerifyEmailQuery(token);

  const {
    mutate: resendEmail,
    isPending: resending,
    error: resendError,
  } = useResendVerificationMutation();

  const handleResend = () => {
    const email = localStorage.getItem("unverifiedEmail");
    resendEmail(email, {
      onSuccess: (data) => {
        setResendSuccess(data.message);
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-35 px-6 font-secondary">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
        <h2
          className="text-xl font-bold text-gray-700"
          dangerouslySetInnerHTML={{
            __html:
              isSuccess && data?.message
                ? data.message
                : "Please verify your email.",
          }}
        />

        {isSuccess && (
          <>
            {localStorage.removeItem("unverifiedEmail")}
            <button
              onClick={() => navigate("/login")}
              className="mt-4 w-full px-4 py-2 bg-orange-500 text-white rounded-md"
            >
              Go to Login
            </button>
          </>
        )}

        {!token && (
          <>
            <p className="text-gray-500 mt-4" data-testid="p-body">
              We’ve sent a verification email. Didn’t receive it?
            </p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="mt-4 w-full px-4 py-2 bg-orange-500 text-white rounded-md"
            >
              {resending ? "Resending..." : "Resend Email"}
            </button>
            {resendSuccess && (
              <p className="text-green-600 mt-2">{resendSuccess}</p>
            )}
          </>
        )}

        {verifying && (
          <p className="text-gray-500 mt-4">Verifying your email...</p>
        )}
        {(isError || resendError) && (
          <p className="text-red-500 mt-2">
            {(error as any)?.response?.data?.error ||
              (resendError as any)?.response?.data?.error ||
              "Something went wrong."}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
