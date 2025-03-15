import { NavLink } from "react-router";
import { ClipboardList, Users, Settings } from "lucide-react";

const SideBar = () => {
  const adminNavItems = [
    { name: "Dashboard", path: "/admin-dashboard", icon: <ClipboardList /> },
    { name: "Users", path: "/admin-users", icon: <Users /> },
    { name: "Settings", path: "/admin-settings", icon: <Settings /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white text-orange-600 py-3 px-4 shadow-lg z-200">
      <NavLink to="/" data-testid="logo-nav">
        <div className="flex">
          <img
            src="/assets/img/Logo1.png"
            alt="logo"
            className="w-12 m-2 mr-3 block"
          />
          <h1 className="text-3xl font-semibold text-orange-600 content-center font-primary">
            Pawtopia
          </h1>
        </div>
      </NavLink>
      <ul>
        {adminNavItems.map(({ name, path, icon }) => (
          <li key={name}>
            <NavLink
              to={path}
              className="flex items-center p-3 hover:bg-orange-500 rounded transition-all"
            >
              {icon} <span className="ml-3">{name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
