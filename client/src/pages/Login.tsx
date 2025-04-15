import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import { LoaderCircle } from "lucide-react";
import { useLoginMutation } from "../hooks/useAuthQueries";

const Login = () => {
  const { login } = useAuth();
  const [data, setData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const loginMutation = useLoginMutation(login);
  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, rememberMe } = data;
    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (!emailCheck.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    setLoading(true);
    loginMutation.mutate({ email, password, rememberMe });
  };

  return (
    <>
      <PageHeader />
      <div className="min-h-screen -mt-20 sm:-mt-30 z-111 relative">
        <form
          data-testid="login-form"
          onSubmit={loginUser}
          className="bg-white max-w-lg w-full p-8 mx-auto shadow-lg rounded-2xl border border-gray-200"
        >
          <h3 className="text-orange-600 text-4xl font-semibold text-center mb-4 font-primary">
            Login
          </h3>
          <p className="text-gray-500 text-sm text-center mb-6 font-secondary">
            Log in to your account and adopt/buy a pet now!
          </p>

          <div className="space-y-5 font-secondary">
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Email
              </label>
              <input
                type="text"
                name="email"
                placeholder="Enter email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full bg-gray-100 text-gray-900 text-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 px-3 py-2 rounded-lg outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full bg-gray-100 text-gray-900 text-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 px-3 py-2 rounded-lg outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 font-secondary">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded accent-orange-500"
                checked={data.rememberMe}
                onChange={() =>
                  setData({ ...data, rememberMe: !data.rememberMe })
                }
              />
              <label htmlFor="remember-me" className="ml-2 text-sm">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-orange-500 text-sm hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-secondary flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="animate-spin w-5 h-5" />
            ) : (
              "Sign in"
            )}
          </button>

          <p className="text-gray-700 text-sm mt-4 text-center font-secondary">
            Don't have an account?
            <Link
              to="/register"
              className="text-orange-500 font-semibold hover:underline ml-1"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
