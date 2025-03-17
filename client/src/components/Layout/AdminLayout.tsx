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
        className={`transition-all min-h-screen pt-25 bg-gray-100 p-10 ${
          isExpanded
            ? "md:ml-60 md:w-[calc(100%-15rem)]"
            : "ml-20 w-[calc(100%-5rem) max-md:ml-0 max-md:w-0]"
        }`}
      >
        <Outlet />
      </div>
      <AdminFooter isExpanded={isExpanded} />
    </>
  );
};

export default AdminLayout;
