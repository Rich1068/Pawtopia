import { NavLink } from "react-router";
import { useRef,useContext, useEffect, useState } from "react";
import { PawPrint, User, LogOut, Menu, X } from "lucide-react";
import {AuthContext} from "../context/AuthContext";

const NavBar = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { user, logout, loading } = useContext(AuthContext)!;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    const dropdownRef = useRef<HTMLDivElement>(null);
        //temporary solution
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                    setDropdownOpen(false);
                }
            };
    
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

    if (loading) return null;
    
    const navItems = [
        { name: "Home", path: "/", testId:"home" },
        { name: "Shop", path: "/shop", testId:"shop" },
        { name: "Adopt", path: "/adopt" , testId:"adopt" },
        { name: "Contact", path: "/contact" , testId:"contact" },
        ]; 


    return( 
        <>
        <header className="flex fixed shadow-md py-3 px-8 sm:px-10 bg-white font-sans min-h-[70px] tracking-wide z-50 mx-auto rounded-b-xl w-full">
        <div className="flex flex-wrap items-center justify-between gap-5 w-full">
            {/* Logo */}
            
            <NavLink to="/" data-testid="logo-nav">
                <div className="flex">
                    <img src="/assets/img/Logo1.png" alt="logo" className='w-12 m-2 mr-3 block' />
                    <h1 className="text-3xl font-semibold text-orange-600 content-center font-primary">Pawtopia</h1>
                </div>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="max-lg:hidden pl-20 lg:block absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex gap-x-6">
                {navItems.map(({ name, path, testId }) => (
                <li key={name}>
                    <NavLink
                    to={path}
                    className={({ isActive }) =>
                        `hover:text-orange-600 text-amber-950 font-secondary  text-lg font-extrabold px-3 py-2 ${
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
            {user ? (
                <>

                    <div className="relative max-sm:hidden" ref={dropdownRef}>
                        <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center p-2 rounded-full bg-white hover:bg-orange-500 border border-orange-500 group"
                        >
                            <User className="w-6 h-6 text-orange-500 group-hover:text-white" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-45 bg-white shadow-lg rounded-md p-2 border border-orange-500 divide-gray-300 divide-y">
                                <div className="px-2 py-1 text-lg text-gray-900 dark:text-white font-secondary font-bold ">
                                    <div >{user?.name}</div>
                                    <div className="font-medium">{user?.email}</div>
                                </div>
                            <NavLink to="/profile" className="block px-4 py-2 font-secondary font-semibold hover:bg-gray-100">
                            Profile
                            </NavLink>
                            <button
                            onClick={() => {
                                logout();
                                setDropdownOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-left font-secondary font-semibold text-red-500 hover:bg-gray-100"
                            >
                            <LogOut className="w-5 h-5 mr-2" />
                                Logout
                            </button>
                        </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                <NavLink to="/login" data-testid="login-nav" className=" max-sm:hidden px-4 py-2 text-sm rounded-full font-bold text-amber-950 border-2 border-orange-600 bg-transparent hover:bg-orange-600 hover:text-white transition-all duration-300">
                    Login
                </NavLink>
                <NavLink to="/register" data-testid="register-nav" className=" max-sm:hidden px-4 py-2 text-sm rounded-full font-bold text-white border-2 border-orange-600 bg-orange-600 transition-all duration-300 hover:bg-transparent hover:text-orange-600">
                    Sign Up
                </NavLink>
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
                <div className=" flex relative">
                    <User className=" w-10 h-10 text-orange-500 border rounded-full border-orange-500 group-hover:text-white" />
                    <div className="content-center ml-2 font-primary font-semibold text-xl text-orange-500"> {user?.name}</div>
                </div>
        <button onClick={() => setIsOpen(false)} className="absolute top-2 right-4">
            <X size={24} />
        </button>
        <div className="mt-5">
            <ul className="space-y-4">
                {navItems.map(({ name, path, testId }) => (
                    <li key={name}>
                        <NavLink
                            to={path}
                            className={({ isActive }) =>
                                `block text-lg font-extrabold px-4 py-2 font-secondary ${
                                    isActive ? "text-orange-600" : "text-amber-950"
                                } hover:text-orange-500`
                            }
                            onClick={() => setIsOpen(false)}
                            data-testid={`${testId}-nav`}
                        >
                        {({ isActive }) => (
                            <div className="flex items-center">
                            {name} {isActive && <PawPrint className="ml-2 motion-safe:animate-bounce" />}
                            </div>
                        )}
                        </NavLink>
                        <hr className="bg-amber-950" />
                    </li>
                ))}
                {user ? (
                    <>
                        <li>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="flex items-center w-full px-4 py-2 text-left text-lg font-extrabold font-secondary text-red-500 hover:bg-gray-100"
                            >
                                Logout
                                <LogOut className="w-5 h-5 ml-2" />
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `block text-lg font-extrabold font-secondary px-4 py-2 ${
                                    isActive ? "text-orange-600" : "text-amber-950"
                                    } hover:text-orange-500`
                                }
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </NavLink>
                            <hr className="bg-amber-950"/>
                        </li>
                        <li>
                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    `block text-lg font-extrabold font-secondary px-4 py-2 ${
                                    isActive ? "text-orange-600" : "text-amber-950"
                                    } hover:text-orange-500`
                                }
                                onClick={() => setIsOpen(false)}
                            >
                                Register
                            </NavLink>
                            <hr className="bg-amber-950"/>
                        </li>
                    </>
                )}
            </ul>
            
            </div>
            </div>
        )}
        </header>
        </>
    );
};






export default NavBar;
