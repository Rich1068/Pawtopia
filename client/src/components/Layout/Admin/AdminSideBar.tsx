import { NavLink } from "react-router";
import { FC } from "react";
import {
  LayoutGrid,
  Calendar,
  UserCircle,
  List,
  Table,
  FileText,
} from "lucide-react";
import { IAdminLayout } from "../../../types/Types";

const AdminSidebar: FC<IAdminLayout> = ({ isExpanded }) => {
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutGrid /> },
    { name: "Calendar", path: "/admin/calendar", icon: <Calendar /> },
    { name: "User Profile", path: "/admin/profile", icon: <UserCircle /> },
    { name: "Forms", path: "/admin/forms", icon: <List /> },
    { name: "Tables", path: "/admin/tables", icon: <Table /> },
    { name: "Pages", path: "/admin/pages", icon: <FileText /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 pt-20 z-50 h-screen bg-white text-amber-950 transition-all duration-400 ease-in-out font-primary text-md font-medium flex flex-col
      ${
        isExpanded
          ? "w-60 translate-x-0 opacity-100"
          : "w-20 -translate-x-full opacity-0 sm:opacity-100 sm:translate-x-0"
      }
    `}
    >
      <nav className="mt-2 flex flex-col gap-2 p-2 px-4">
        {navItems.map(({ name, path, icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `rounded-xl flex items-center px-2 py-3 transition ${
                isExpanded ? "gap-4 justify-start" : "justify-center"
              } ${
                isActive
                  ? "bg-orange-300/25 text-orange-600"
                  : "hover:bg-orange-50"
              }`
            }
          >
            {icon} {isExpanded && <span>{name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
