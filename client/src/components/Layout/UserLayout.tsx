import UserNavBar from "./User/UserNavBar";
import UserFooter from "./User/UserFooter";
import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <>
      <UserNavBar />
      <div className="pt-18">
        <Outlet />
      </div>
      <UserFooter />
    </>
  );
};

export default UserLayout;
