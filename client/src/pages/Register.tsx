import { useState } from "react";
import serverAPI from "../helper/axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router";
import validate from "../helper/validation";

export const Register = () => {
  const navigate = useNavigate();
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
    try {
      await serverAPI.post("/register", {
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
      toast.success("Login Successful. Welcome");
      navigate("/login");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong, please try again.");
      }
    }
  };
  return (
    <>
      <div className=" relative h-[240px] font-[sans-serif] bg-orange-600 z-10">
        <div className="">
          <form
            onSubmit={registerUser}
            className="bg-white max-w-xl mt-30 absolute left-0 right-0 align-middle w-full mx-auto shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-6 sm:p-8 rounded-2xl"
          >
            <div className="mb-12">
              <h3 className="text-orange-600 font-primary font-normal text-4xl text-center">
                Register
              </h3>
            </div>

            <div className="mb-8">
              <label className="text-gray-800 text-xs block mb-2">
                Full Name
                <input
                  type="text"
                  name="fullname"
                  placeholder="Enter name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-orange-500 pl-2 pr-8 py-3 outline-none"
                />
              </label>
            </div>

            <div className="mb-8">
              <label className="text-gray-800 text-xs block mb-2">
                Email
                <input
                  type="text"
                  name="email"
                  placeholder="Enter email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-orange-500 pl-2 pr-8 py-3 outline-none"
                />
              </label>
            </div>

            <div className="mb-8">
              <label className="text-gray-800 text-xs block mb-2">
                Phone Number
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter Phone Number (ex. 09171234987)"
                  value={data.phoneNumber}
                  onChange={(e) =>
                    setData({ ...data, phoneNumber: e.target.value })
                  }
                  className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-orange-500 pl-2 pr-8 py-3 outline-none"
                />
              </label>
            </div>

            <div className="mb-8">
              <label className="text-gray-800 text-xs block mb-2">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-orange-500 pl-2 pr-8 py-3 outline-none"
                />
              </label>
            </div>

            <div className="mb-8">
              <label className="text-gray-800 text-xs block mb-2">
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={data.confirmPassword}
                  onChange={(e) =>
                    setData({ ...data, confirmPassword: e.target.value })
                  }
                  className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-orange-500 pl-2 pr-8 py-3 outline-none"
                />
              </label>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold tracking-wider rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none transition-all"
              >
                Register
              </button>
              <p className="text-gray-800 text-sm mt-4 text-center">
                Already have an account?
                <Link
                  to="/login"
                  className="text-orange-500 font-semibold hover:underline ml-1"
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <div className=" absolute bottom-0 min-w-full min-h-full bg-cover md:bg-contain bg-[url(/assets/img/wallpaper.jpg)]"></div>
    </>
  );
};

export default Register;
