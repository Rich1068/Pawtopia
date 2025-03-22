import { NavLink } from "react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useFavorites } from "../../../context/FavoritesContext";
import Logo from "../../Logo";
import MobileSidebar from "./NavBarComponents/MobileSideBar";
import NavigationLinks from "./NavBarComponents/NavigationLinks";
import CartDropdown from "./NavBarComponents/CartDropdown";
import FavoriteDropdown from "./NavBarComponents/FavoritesDropdown";
import ProfileDropdown from "./NavBarComponents/ProfileDropdown";

const UserNavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { user, logout, loading } = useAuth();
  const { favorites } = useFavorites();
  const [closing, setClosing] = useState(false);

  if (loading) return null;

  const navItems = [
    { name: "Home", path: "/", testId: "home" },
    { name: "Shop", path: "/shop", testId: "shop" },
    { name: "Adopt", path: "/adopt", testId: "adopt" },
    { name: "Contact", path: "/contact", testId: "contact" },
  ];

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setClosing(false);
    }, 300); // Matches animation duration
  };

  return (
    <header className="flex fixed shadow-md py-3 max-sm:px-6 sm:px-10 sm:m-auto bg-white min-h-[70px] tracking-wide z-200 mx-auto rounded-b-xl w-full">
      <div className="flex flex-wrap flex-row items-center justify-between gap-5 w-full">
        <Logo />
        <NavigationLinks navItems={navItems} />
        <div className="flex max-lg:ml-auto space-x-4 w-auto">
          {user ? (
            <>
              <CartDropdown />
              <FavoriteDropdown />
              <ProfileDropdown />
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                data-testid="login-nav"
                className=" max-sm:hidden px-4 py-2 text-sm rounded-full font-bold text-amber-950 border-2 border-orange-600 bg-transparent hover:bg-orange-600 hover:text-white transition-all duration-300"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                data-testid="register-nav"
                className=" max-sm:hidden px-4 py-2 text-sm rounded-full font-bold text-white border-2 border-orange-600 bg-orange-600 transition-all duration-300 hover:bg-transparent hover:text-orange-600"
              >
                Sign Up
              </NavLink>
            </>
          )}
          <button
            className="lg:hidden"
            onClick={() =>
              isMobileMenuOpen ? handleClose() : setIsMobileMenuOpen(true)
            }
          >
            {isMobileMenuOpen ? (
              <X size={28} className="text-amber-950" />
            ) : (
              <Menu size={28} className="text-amber-950" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        closing={closing}
        handleClose={() => setIsMobileMenuOpen(false)}
        user={user}
        logout={logout}
        favorites={favorites}
        navItems={navItems}
      />
    </header>
  );
};

export default UserNavBar;
