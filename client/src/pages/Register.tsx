import { useState } from "react";
import serverAPI from "../helper/axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router";
import validate from "../helper/validation";
import { LoaderCircle } from "lucide-react";
import PageHeader from "../components/PageHeader";

export const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, phoneNumber, password, confirmPassword } = data;

    if (!validate(name, email, phoneNumber, password, confirmPassword, true)) {
      return;
    }

    setLoading(true);
    try {
      const { data } = await serverAPI.post("/register", {
        name,
        email,
        phoneNumber,
        password,
        confirmPassword,
      });

      setData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });

      toast.success("Registered Successfully, Please Verify Your Email");
      localStorage.setItem("unverifiedEmail", data.email);
      navigate("/verify-email");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Something went wrong, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader />
      <div className="min-h-screen -mt-20 sm:-mt-30 relative z-111">
        <form
          data-testid="register-form"
          onSubmit={registerUser}
          className="bg-white max-w-xl w-full mx-auto shadow-lg p-8 sm:p-10 rounded-2xl border border-gray-200"
        >
          <h3 className="text-orange-600 text-4xl text-center font-semibold mb-6 font-primary">
            Create Account
          </h3>

          {/* Input Fields */}
          {[
            { name: "name", type: "text", placeholder: "Enter your full name" },
            { name: "email", type: "email", placeholder: "Enter your email" },
            {
              name: "phoneNumber",
              type: "text",
              placeholder: "Enter your phone number (ex. 09171234987)",
            },
            {
              name: "password",
              type: "password",
              placeholder: "Enter your password",
            },
            {
              name: "confirmPassword",
              type: "password",
              placeholder: "Confirm your password",
            },
          ].map(({ name, type, placeholder }) => (
            <div key={name} className="mb-6 font-secondary">
              <label className="block text-gray-700 text-sm font-medium mb-2 capitalize">
                {name.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                value={data[name as keyof typeof data]}
                onChange={(e) => setData({ ...data, [name]: e.target.value })}
                className="w-full bg-gray-100 text-gray-900 text-sm border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 px-3 py-3 rounded-lg outline-none transition-all"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center py-3 px-4 text-sm font-semibold tracking-wider rounded-lg text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-gray-700 text-sm mt-5 text-center font-secondary">
            Already have an account?
            <Link
              to="/login"
              className="text-orange-500 font-semibold hover:underline ml-1"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
