import useForgotPassword from "../../hooks/useForgotPassword";

const ForgotPasswordSection = () => {
  const { email, setEmail, isLoading, handleSubmit } = useForgotPassword();

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
            type="text"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="email-input"
          />
        </label>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded hover:bg-orange-500 transition font-secondary"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordSection;
