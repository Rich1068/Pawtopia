import { NavLink } from "react-router";
import { useContext, useState } from "react";
import { PawPrint, User, LogOut, Menu, X } from "lucide-react";
import {AuthContext} from "../helpers/AuthContext";
const NavBar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { user, logout } = useContext(AuthContext)!;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navItems = [
        { name: "Home", path: "/", testId:"home" },
        { name: "Shop", path: "/shop", testId:"shop" },
        { name: "Adopt", path: "/adopt" , testId:"adopt" },
        { name: "Contact", path: "/contact" , testId:"contact" },
        ]; 
    const mobileNavItems = [
        ...navItems,
        { name: "Register", path: "/register", testId: "register" },
        { name: "Login", path: "/login", testId: "login" },
        ];
    return( 
        <>
        <header className="flex fixed shadow-md py-3 px-8 sm:px-10 bg-white font-sans min-h-[70px] tracking-wide z-50  rounded-b-xl w-full">
        <div className="flex flex-wrap items-center justify-between gap-5 w-full">
            {/* Logo */}
            
            <NavLink to="/" data-testid="logo-nav">
                <div className="flex">
                    <img src="/assets/img/Logo1.png" alt="logo" className='w-12 m-2 mr-3 block' />
                    <h1 className="text-3xl font-semibold text-orange-600 content-center font-primary">Pawtopia</h1>
                </div>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="max-lg:hidden lg:block">
            <ul className="lg:flex gap-x-6">
                {navItems.map(({ name, path, testId }) => (
                <li key={name}>
                    <NavLink
                    to={path}
                    className={({ isActive }) =>
                        `hover:text-orange-600 text-amber-950  text-lg font-semibold px-3 py-2 ${
                        isActive ? "text-orange-500" : ""
                        }`
                    }
                    data-testid={`${testId}-nav`}
                    >
                    {name}
                    </NavLink>
                </li>
                ))}
            </ul>
            </nav>

            {/* Auth Buttons */}
            <div className="flex max-lg:ml-auto space-x-4">
            {!user ? (
                <>
                <NavLink to="/login" data-testid="login-nav" className=" max-sm:hidden px-4 py-2 text-sm rounded-full font-bold text-amber-950 border-2 border-orange-600 bg-transparent hover:bg-orange-600 hover:text-white transition-all duration-300">
                    Login
                </NavLink>
                <NavLink to="/register" data-testid="register-nav" className=" max-sm:hidden px-4 py-2 text-sm rounded-full font-bold text-white border-2 border-orange-600 bg-orange-600 transition-all duration-300 hover:bg-transparent hover:text-orange-600">
                    Sign Up
                </NavLink>
                </>
            ) : (
                <>
                <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <User className="w-6 h-6 text-gray-600" />
              <span className="hidden sm:inline">{user.name}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2">
                <NavLink to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                  Dashboard
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
                </>
            )}
            
            
            {/* Mobile Menu Button */}
            <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
            <div className="bg-white fixed top-0 left-0 w-1/2 min-w-[300px] h-full shadow-md p-6 z-50">
                <img src="/assets/img/Logo1.png" alt="logo" className='w-20 block' />
            <button onClick={() => setIsOpen(false)} className="absolute top-2 right-4">
                <X size={24} />
            </button>
            <div className="mt-5">
            <ul className="space-y-4">
                {mobileNavItems.map(({ name, path, testId }) => (
                <li key={name}>
                    <NavLink
                    to={path}
                    className={({ isActive }) =>
                        `block text-lg font-semibold px-4 py-2 ${
                        isActive ? "text-orange-600" : "text-amber-950"
                        } hover:text-orange-500`
                    }
                    onClick={() => setIsOpen(false)}
                    data-testid={`${testId}-nav`}
                    >
                        <div className="flex">
                            {name} <span className="pl-2 content-center"><PawPrint /></span>
                        </div>
                    </NavLink>
                    <hr className="bg-amber-950"/>
                </li>

                ))}
            </ul>
            </div>
            </div>
        )}
        </header>
        </>
    );
};






export default NavBar;
