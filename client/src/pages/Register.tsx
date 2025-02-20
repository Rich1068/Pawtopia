import {useState} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

export const Register = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const registerUser = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const {name, email, password, confirmPassword} = data
        try {
            await axios.post('http://localhost:8000/register', {
                name, email, password, confirmPassword
            })
              setData({
                  name: '',
                  email: '',
                  password: '',
                  confirmPassword: ''
              })
              toast.success('Login Successful. Welcome')
              navigate('/login')
            
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
      <div className=" relative h-[240px] font-[sans-serif] bg-orange-600 z-10">
      <div className="">
        <form
          onSubmit={registerUser}
          className="bg-white max-w-xl mt-30 absolute left-0 right-0 align-middle w-full mx-auto shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-6 sm:p-8 rounded-2xl"
        >
          <div className="mb-12">
            <h3 className="text-orange-600 font-primary font-normal text-4xl text-center">Register</h3>
          </div>

          <div className="mb-8">
            <label className="text-gray-800 text-xs block mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 pl-2 pr-8 py-3 outline-none"
            />
          </div>

          <div className="mb-8">
            <label className="text-gray-800 text-xs block mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 pl-2 pr-8 py-3 outline-none"
            />
          </div>

          <div className="mb-8">
            <label className="text-gray-800 text-xs block mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 pl-2 pr-8 py-3 outline-none"
            />
          </div>

          <div className="mb-8">
            <label className="text-gray-800 text-xs block mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={data.confirmPassword}
              onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
              required
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 pl-2 pr-8 py-3 outline-none"
            />
          </div>

          <div className="flex items-center mt-8">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 shrink-0 rounded"
              required
            />
            <label htmlFor="terms" className="ml-3 text-sm">
              I accept the
              <a
                href="javascript:void(0);"
                className="text-blue-500 font-semibold hover:underline ml-1"
              >
                Terms and Conditions
              </a>
            </label>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all"
            >
              Register
            </button>
            <p className="text-gray-800 text-sm mt-4 text-center">
              Already have an account?
              <a
                href="javascript:void(0);"
                className="text-blue-500 font-semibold hover:underline ml-1"
              >
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
    <div className=" absolute bottom-0 min-w-full min-h-full bg-cover md:bg-contain bg-[url(/assets/img/wallpaper.jpg)]">
    </div>
        </>
        );
};

export default Register;
