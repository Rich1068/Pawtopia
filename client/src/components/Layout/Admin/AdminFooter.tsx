import { FC } from "react";
import { IAdminLayout } from "../../../types/Types";

const AdminFooter: FC<IAdminLayout> = ({ isExpanded }) => {
  return (
    <footer
      className={`w-full bottom-0 bg-white shadow-md py-4 text-center text-gray-700 text-sm transition-all ${
        isExpanded
          ? "md:ml-60 md:w-[calc(100%-15rem)]"
          : "ml-20 w-[calc(100%-5rem) max-md:ml-0 max-md:w-0]"
      }`}
    >
      © {new Date().getFullYear()} Pawtopia. All rights reserved.
    </footer>
  );
};

export default AdminFooter;
