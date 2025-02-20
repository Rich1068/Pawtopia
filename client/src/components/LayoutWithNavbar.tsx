import NavBar from "./Navbar";
import { Outlet } from "react-router";
const LayoutWithNavbar = () => {
    return (
      <>
        <NavBar />
          <Outlet />
      </>
    );
  };

  export default LayoutWithNavbar