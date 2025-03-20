import { PawPrint } from "lucide-react";
import Breadcrumbs from "./BreadCrumbs";
import { FC } from "react";

export const PageHeader: FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="relative z-20 flex items-center h-40 sm:h-50 lg:h-60 bg-orange-600 ">
      {text && (
        <div className="max-w-4xl max-[641px]:px-10 px-14 md:pl-[7%] mt-0.5">
          <h1 className="max-md:text-4xl md:text-5xl lg:text-6xl text-white font-semibold drop-shadow-sm font-primary ">
            <div className="flex">
              {text}
              <span className="content-center pl-2">
                <PawPrint size={40} />
              </span>
            </div>
          </h1>
          <Breadcrumbs />
        </div>
      )}
    </div>
  );
};

export default PageHeader;
