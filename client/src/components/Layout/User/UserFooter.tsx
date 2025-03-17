import { NavLink } from "react-router";
import Logo from "../../Logo";

export const UserFooter = () => {
  const footerItems = [
    { name: "Home", path: "/", testId: "home" },
    { name: "Shop", path: "/shop", testId: "shop" },
    { name: "Adopt", path: "/adopt", testId: "adopt" },
    { name: "Contact", path: "/contact", testId: "contact" },
  ];
  return (
    <footer className="mx-auto w-full max-w-container">
      <div className="border-t border-slate-900/5 rounded-t-xl py-5 bg-white bg-center bg-no-repeat text-center">
        <div className="flex items-center justify-center text-sm font-semibold leading-6 text-slate-700">
          <ul className="flex flex-col md:flex-row items-center text-center">
            {footerItems.map(({ name, path, testId }, index) => (
              <li key={name} className="inline-flex items-center">
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `hover:text-orange-600 text-amber-950 font-secondary text-lg font-extrabold px-4 py-2 md:px-8 ${
                      isActive ? "text-orange-500" : ""
                    }`
                  }
                  data-testid={`${testId}-footer`}
                >
                  {name}
                </NavLink>
                {index !== footerItems.length - 1 && (
                  <span className="text-slate-500 hidden md:inline">|</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <Logo style="justify-center" />
        </div>
        <p className="text-center text-sm leading-6 text-slate-500">
          © 2025 Pawtopia All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default UserFooter;
