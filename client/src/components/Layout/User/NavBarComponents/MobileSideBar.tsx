import { NavLink } from "react-router";
import { FC, JSX } from "react";
import {
  X,
  LogOut,
  UserRound,
  Home,
  ShoppingCart,
  Heart,
  Mail,
  ShoppingBag,
} from "lucide-react";
import type { User, FavoritePets } from "../../../../types/Types";
import { useCart } from "../../../../context/CartContext";

interface IMobileSidebar {
  isOpen: boolean;
  closing: boolean;
  handleClose: () => void;
  user: User | null;
  logout: () => void;
  favorites: FavoritePets[];
  navItems: { name: string; path: string; testId: string }[];
}

// Map navItem names to Lucide icons
const iconMap: Record<string, JSX.Element> = {
  Home: <Home />,
  Shop: <ShoppingBag />,
  Adopt: <Heart />,
  Contact: <Mail />,
};

const MobileSidebar: FC<IMobileSidebar> = ({
  isOpen,
  closing,
  handleClose,
  user,
  logout,
  favorites,
  navItems,
}) => {
  const { cart } = useCart();
  const cartLength = cart?.products.length || 0;

  if (!isOpen) return null;

  return (
    <div
      className={`bg-white fixed top-0 left-0 w-3/4 sm:w-1/2 min-w-[300px] h-full shadow-md p-6 z-50 transform transition-transform duration-300 ease-in-out 
        ${closing ? "animate-slide-out" : "animate-slide-in"}`}
    >
      {/* User Profile */}
      <div className="flex items-center relative">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
          />
        ) : (
          <UserRound className="w-8 h-8 text-orange-500 border rounded-full cursor-pointer" />
        )}
        <div className="ml-2 font-primary font-semibold text-xl text-orange-500">
          {user?.name}
        </div>
      </div>

      {/* Close Button */}
      <button onClick={handleClose} className="absolute top-2 right-2">
        <X size={24} className="text-amber-950" />
      </button>

      {/* Navigation Links */}
      <nav className="mt-5">
        <ul className="space-y-2">
          {navItems.map(({ name, path, testId }) => (
            <li key={name}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-secondary font-extrabold text-lg transition-all ${
                    isActive
                      ? "bg-orange-300/25 text-orange-600"
                      : "hover:bg-orange-50 text-amber-950"
                  }`
                }
                onClick={handleClose}
                data-testid={`${testId}-nav`}
              >
                {iconMap[name] || <Home />} {name}
              </NavLink>
            </li>
          ))}

          {/* Authentication Links */}
          {user ? (
            <>
              {/* Favorites */}
              <li>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-secondary font-extrabold text-lg transition-all ${
                      isActive
                        ? "bg-orange-300/25 text-orange-600"
                        : "hover:bg-orange-50 text-amber-950"
                    }`
                  }
                  onClick={handleClose}
                  data-testid="fav-nav"
                >
                  <Heart /> Favorites{" "}
                  {favorites.length > 0 ? `(${favorites.length})` : ""}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/shop/checkout"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-secondary font-extrabold text-lg transition-all ${
                      isActive
                        ? "bg-orange-300/25 text-orange-600"
                        : "hover:bg-orange-50 text-amber-950"
                    }`
                  }
                  onClick={handleClose}
                  data-testid="fav-nav"
                >
                  <ShoppingCart /> Cart{" "}
                  {cartLength > 0 ? `(${cartLength})` : null}
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    handleClose();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-bold text-lg text-red-500 hover:bg-gray-100 transition-all"
                >
                  <LogOut /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-secondary font-extrabold text-lg transition-all ${
                      isActive
                        ? "bg-orange-300/25 text-orange-600"
                        : "hover:bg-orange-50 text-amber-950"
                    }`
                  }
                  onClick={handleClose}
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-secondary font-extrabold text-lg transition-all ${
                      isActive
                        ? "bg-orange-300/25 text-orange-600"
                        : "hover:bg-orange-50 text-amber-950"
                    }`
                  }
                  onClick={handleClose}
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default MobileSidebar;
