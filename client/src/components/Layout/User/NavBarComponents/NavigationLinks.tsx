import { NavLink } from "react-router";
import { FC } from "react";

interface INavigationLinks {
  navItems: { name: string; path: string; testId: string }[];
}

const NavigationLinks: FC<INavigationLinks> = ({ navItems }) => (
  <nav className="max-lg:hidden lg:block absolute left-1/2 transform -translate-x-1/2">
    <ul className="flex gap-x-6">
      {navItems.map(({ name, path, testId }) => (
        <li key={name}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              `hover:text-orange-600 text-amber-950 font-secondary text-lg font-extrabold px-3 py-2 ${
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
);

export default NavigationLinks;
