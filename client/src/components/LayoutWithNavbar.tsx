import NavBar from "./NavBar";
import { Outlet } from "react-router";
const LayoutWithNavbar = () => {
  return (
    <>
      <NavBar />
      <div className="pt-18">
        <Outlet />
      </div>
    </>
  );
};

export default LayoutWithNavbar;
