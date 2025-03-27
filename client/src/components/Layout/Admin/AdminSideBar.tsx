import { NavLink } from "react-router";
import { FC, useState } from "react";
import {
  LayoutGrid,
  Calendar,
  UserCircle,
  List,
  Table,
  FileText,
  Store,
  ChevronDown,
} from "lucide-react";
import { IAdminLayout } from "../../../types/Types";

const AdminSidebar: FC<IAdminLayout> = ({ isExpanded, setIsExpanded }) => {
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const isStoreActive =
    location.pathname.startsWith("/admin/add-product") ||
    location.pathname.startsWith("/admin/product-list");
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutGrid /> },
    {
      name: "Store",
      icon: <Store />,
      path: "",
      isDropdown: true,
      subItems: [
        { name: "Add Product", path: "/admin/add-product" },
        { name: "Product List", path: "/admin/product-list" },
      ],
    },
    { name: "Calendar", path: "/admin/calendar", icon: <Calendar /> },
    { name: "User Profile", path: "/admin/profile", icon: <UserCircle /> },
    { name: "Forms", path: "/admin/forms", icon: <List /> },
    { name: "Tables", path: "/admin/tables", icon: <Table /> },
    { name: "Pages", path: "/admin/pages", icon: <FileText /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 pt-20 z-50 h-screen bg-white text-amber-950 transition-all duration-400 ease-in-out font-primary text-lg font-medium flex flex-col
      ${
        isExpanded
          ? "w-60 translate-x-0 opacity-100"
          : "w-20 -translate-x-full opacity-0 sm:opacity-100 md:translate-x-0"
      }
    `}
    >
      <nav className=" flex flex-col gap-2 p-2 px-4">
        {navItems.map(({ name, path, icon, isDropdown, subItems }) =>
          isDropdown ? (
            <div key={name} className="flex flex-col">
              <button
                onClick={() => {
                  if (!isExpanded) {
                    setIsExpanded!(true);
                  } else {
                    setIsStoreOpen(!isStoreOpen);
                  }
                }}
                className={`rounded-xl flex items-center px-2 py-3 transition w-full ${
                  isExpanded ? "gap-4 justify-start" : "justify-center"
                } hover:bg-orange-50 ${
                  isStoreActive
                    ? "bg-orange-300/25 text-orange-600" // Active style
                    : "hover:bg-orange-50"
                }`}
              >
                {icon} {isExpanded && <span>{name}</span>}
                {isExpanded && (
                  <ChevronDown
                    size={18}
                    className={`ml-auto transition-transform ${
                      isStoreOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              {isExpanded && isStoreOpen && (
                <div className="flex flex-col pl-10 text-base">
                  {subItems?.map(({ name, path }) => (
                    <NavLink
                      key={name}
                      to={path}
                      className={({ isActive }) =>
                        `rounded-lg px-2 py-2 transition ${
                          isActive
                            ? "hover:bg-orange-50 text-orange-600"
                            : "hover:bg-orange-50"
                        }`
                      }
                    >
                      {name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
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
          )
        )}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
