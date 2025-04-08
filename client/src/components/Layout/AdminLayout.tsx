import AdminSideBar from "./Admin/AdminSideBar";
import { Outlet } from "react-router";
import AdminFooter from "./Admin/AdminFooter";
import AdminNavBar from "./Admin/AdminNavBar";
import { useState } from "react";

const AdminLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      <AdminNavBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <AdminSideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div
        className={`transition-all min-h-screen !pt-25 p-4 sm:p-8 ${
          isExpanded ? "md:ml-60" : "ml-20 max-md:ml-0 max-md:w-0]"
        }`}
      >
        <Outlet />
      </div>
      <AdminFooter isExpanded={isExpanded} />
    </>
  );
};

export default AdminLayout;
