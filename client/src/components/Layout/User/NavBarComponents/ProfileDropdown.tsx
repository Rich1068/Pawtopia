import { UserRound, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../../../../context/AuthContext";

const ProfileDropdown = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={profileDropdownRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
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

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-50 bg-white shadow-lg rounded-md p-1 border border-orange-500 divide-gray-300 divide-y">
          <div className="px-4 py-1 text-xl text-gray-900 font-secondary font-bold break-words">
            <div className="font-primary text-orange-600">{user?.name}</div>
            <div className="font-medium text-base text-amber-950">
              {user?.email}
            </div>
          </div>
          <NavLink
            to="/profile"
            className="block px-4 py-2 font-secondary font-bold text-amber-950 hover:bg-gray-100"
            onClick={() => setIsProfileOpen(false)}
          >
            Profile
          </NavLink>
          {user!.role === "admin" ? (
            <NavLink
              to="/admin/dashboard"
              className="block px-4 py-2 font-secondary font-bold text-amber-950 hover:bg-gray-100"
              onClick={() => setIsProfileOpen(false)}
            >
              Dashboard
            </NavLink>
          ) : null}
          <NavLink
            to="/order-history"
            className="block px-4 py-2 font-secondary font-bold text-amber-950 hover:bg-gray-100"
            onClick={() => setIsProfileOpen(false)}
          >
            Order History
          </NavLink>
          <NavLink
            to="/request-history"
            className="block px-4 py-2 font-secondary font-bold text-amber-950 hover:bg-gray-100"
            onClick={() => setIsProfileOpen(false)}
          >
            Request History
          </NavLink>
          <button
            onClick={() => {
              logout();
              setIsProfileOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-left font-secondary font-bold text-red-500 hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
