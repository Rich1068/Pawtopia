import { Bell, Menu, LogOut, UserRound } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import type { IAdminLayout } from "../../../types/Types";
import { Link } from "react-router";
import Logo from "../../Logo";

const AdminNavbar: FC<IAdminLayout> = ({ isExpanded, setIsExpanded }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <nav
      className={`fixed top-0 h-[79px] z-125 bg-white shadow-md flex items-center justify-between text-amber-950 transition-all w-full`}
    >
      {/* Sidebar Toggle Button */}
      <div className=" px-1 py-1 flex items-center sm:justify-between max-w-70 w-full">
        <div className="max-sm:hidden">
          <Logo />
        </div>
        <img
          src="/assets/img/Logo1.png"
          alt="logo"
          className="w-12 mr-3 block sm:hidden"
        />
        <button
          onClick={() => setIsExpanded!(!isExpanded)}
          className="rounded-lg hover:bg-gray-100"
        >
          <Menu size={28} className="cursor-pointer" />
        </button>
      </div>

      {/* Spacer to push icons to the right */}
      <div className="flex-1"></div>

      {/* Notification & Profile Icons */}
      <div className="flex items-center gap-6 max-sm:gap-2 pr-2 sm:pr-4">
        <Bell
          size={28}
          className="cursor-pointer hover:text-orange-500 transition"
        />
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center p-2 bg-white group rounded-full"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover group-hover:text-white cursor-pointer"
              />
            ) : (
              <UserRound className="w-8 h-8 text-orange-500 border rounded-full group-hover:text-white group-hover:bg-orange-500 group-hover:border-orange-500 cursor-pointer" />
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-45 bg-white shadow-lg rounded-md p-2 border border-orange-500 divide-gray-300 divide-y">
              <div className="px-2 py-1 text-lg text-gray-900 font-secondary font-bold ">
                <div>{user?.name}</div>
                <div className="font-medium">{user?.email}</div>
              </div>
              <Link
                to="/profile"
                className="block px-4 py-2 font-secondary font-semibold hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
              {user!.role === "admin" ? (
                <Link
                  to="/admin/dashboard"
                  className="block px-4 py-2 font-secondary font-semibold hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
              ) : null}
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
      </div>
    </nav>
  );
};

export default AdminNavbar;
