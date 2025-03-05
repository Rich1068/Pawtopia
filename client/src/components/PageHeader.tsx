import { PawPrint } from "lucide-react";
import Breadcrumbs from "./BreadCrumbs";
import { FC } from "react";
export const PageHeader: FC<{ text: string }> = ({ text }) => {
  return (
    <div className="flex items-center h-[240px] bg-orange-600 ">
      <div className="max-w-4xl lg:mx-35 text-left max-lg:mx-20">
        <h1 className="max-md:text-4xl md:text-5xl lg:text-6xl text-white font-semibold drop-shadow-sm font-primary ">
          <div className="flex">
            {text}
            <span className="content-center pl-2">
              <PawPrint size={40} className="" />
            </span>
          </div>
        </h1>
        <Breadcrumbs />
      </div>
    </div>
  );
};

export default PageHeader;
