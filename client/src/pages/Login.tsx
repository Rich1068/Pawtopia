import {useContext, useState} from 'react';
import serverAPI from '../helper/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { AuthContext } from "../context/AuthContext";
const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext)!;
    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const loginUser = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const {email, password} = data;
        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.email || !data.password) {
          toast.error("All fields are required");
          return;
        }

        if (data.email && !emailCheck.test(data.email)) {
            toast.error("Invalid email format");
            return
        }
        try {
           const {data} = await serverAPI.post('/login', {
            email, password
           }, { withCredentials: true })
            await login();
            setData({
                email: '',
                password: ''
            })
            if(data.userData.role === 'user') {
                navigate('/user-dashboard')
            } else {
                navigate('/admin-dashboard')
            }
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
          if (error.response) {
            toast.error(error.response.data.error);
          } else {
              toast.error("Something went wrong, please try again.");
          }
        }
    }
    return( 
    <>
      <div className=" relative h-[240px] bg-orange-600 z-10">
      <div className="">
        <form
          onSubmit={loginUser}
          className="bg-white max-w-xl mt-30 absolute left-0 right-0 align-middle w-full mx-auto shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-6 sm:p-8 rounded-2xl"
        >
          <div className="mb-12">
            <h3 className="text-orange-600 font-primary font-normal text-4xl text-center">Login</h3>
            <p className="text-gray-500 text-sm mt-4 leading-relaxed">
              Log in to your account and adopt/buy a pet now!.
            </p>
          </div>
          <div className=' font-secondary font-semibold'>
          <div className="mb-8">
            <label className="text-gray-800 text-xs block mb-2">Email
            <input
              type="text"
              name="email"
              placeholder="Enter email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 pl-2 pr-8 py-3 outline-none"
            /></label>
          </div>

          <div className="mb-8">
            <label className="text-gray-800 text-xs block mb-2">Password
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 pl-2 pr-8 py-3 outline-none"
            /></label>
          </div>

          <div className="flex items-center mt-8">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 shrink-0 rounded"
            />
            <label htmlFor="remember-me" className="ml-3 text-sm">
              Remember me
            </label>
            <a
              href="javascript:void(0);"
              className="ml-auto text-blue-500 font-semibold hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all"
            >
              Sign in
            </button>
            <p className="text-gray-800 text-sm mt-4 text-center">
              Don't have an account?
              <a
                href="javascript:void(0);"
                className="text-blue-500 font-semibold hover:underline ml-1"
              >
                Register here
              </a>
            </p>
          </div>
          </div>
        </form>
      </div>
    </div>
    <div className=" absolute bottom-0 min-w-full min-h-full bg-cover md:bg-contain bg-[url(/assets/img/wallpaper.jpg)]">
    </div>
    </>

    
    );
};

export default Login;
