import { NavLink } from "react-router";
import {Menu, X} from 'lucide-react'
import { useState } from "react";
import { PawPrint } from "lucide-react";
const NavBar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const navItems = [
        { name: "Home", path: "/", testId:"home" },
        { name: "Shop", path: "/shop", testId:"shop" },
        { name: "Adopt", path: "/adopt" , testId:"adopt" },
        { name: "Contact", path: "/contact" , testId:"contact" },
        ] 
    return( 
        <>
        <header className="flex shadow-md py-3 px-8 sm:px-10 bg-white font-sans min-h-[70px] tracking-wide relative z-50">
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
            <NavLink to="/login" data-testid="login-nav" className=" max-sm:hidden px-4 py-2 text-sm rounded-full font-bold text-amber-950 border-2 border-orange-600 bg-transparent hover:bg-orange-600 hover:text-white transition-all duration-300">
                Login
            </NavLink>
            <NavLink to="/register" data-testid="register-nav" className=" max-sm:hidden px-4 py-2 text-sm rounded-full font-bold text-white border-2 border-orange-600 bg-orange-600 transition-all duration-300 hover:bg-transparent hover:text-orange-600">
                Sign Up
            </NavLink>
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
                {navItems.concat([
                    { name: "Register", path: "/register", testId:"register" },
                    { name: "Login", path: "/login", testId:"login" },])
                .map(({ name, path, testId }) => (
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
