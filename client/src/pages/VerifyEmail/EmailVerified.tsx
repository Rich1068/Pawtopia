import { useNavigate } from "react-router";

const EmailVerified = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 text-center">
      <h2 className="text-2xl font-semibold text-green-600">Email Verified!</h2>
      <p className="text-gray-500 mb-6">You can now log in to your account.</p>

      <button
        onClick={() => navigate("/login")}
        className="py-2 px-4 bg-green-600 text-white font-semibold rounded hover:bg-green-500 transition"
      >
        Go to Login
      </button>
    </div>
  );
};

export default EmailVerified;
