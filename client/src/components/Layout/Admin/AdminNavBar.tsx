import { Bell, Menu } from "lucide-react";
import { FC } from "react";
import type { IAdminLayout } from "../../../types/Types";
import Logo from "../../Logo";
import ProfileDropdown from "../User/NavBarComponents/ProfileDropdown";

const AdminNavbar: FC<IAdminLayout> = ({ isExpanded, setIsExpanded }) => {
  return (
    <nav
      className={`fixed top-0 h-[79px] z-125 bg-white shadow-md flex items-center justify-between text-amber-950 transition-all w-full`}
    >
      {/* Sidebar Toggle Button */}
      <div className="sm:px-0.5 px-4.5 py-1 flex items-center sm:justify-between max-w-70 w-full">
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
        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default AdminNavbar;
