import { PawPrint } from "lucide-react";
import "./AdoptHeroSection.css";
import { useRef, FC } from "react";
import toast from "react-hot-toast";
import type { Selection } from "../../types/Types";
const AdoptHeroSection: FC<Selection> = ({ selected, setSelected }) => {
  const toastShown = useRef(false);

  const selection = (item: "cat" | "dog") => {
    setSelected((prev) => {
      const newState = { ...prev, [item]: !prev[item] };
      if (!newState.dog && !newState.cat) {
        newState[item] = true;
        if (!toastShown.current) {
          // Prevent multiple toasts
          toast.error("At least one option must remain selected", {
            position: "top-center",
          });
          toastShown.current = true;

          // Reset after a short delay so it can trigger again if needed
          setTimeout(() => {
            toastShown.current = false;
          }, 2000);
        }
      }
      return newState;
    });
  };

  return (
    <div className="flex flex-col gap-5 relative overflow-hidden">
      {/* First Box */}
      <div
        onClick={() => selection("cat")}
        className={`first bg-center bg-cover border-5 border-orange-600 transition-all duration-300 cursor-pointer 
              ${selected.cat ? " opacity-100 scale-105" : "opacity-50"}`}
      >
        <div className="max-w-4xl -mt-46 ml-auto mr-auto max-sm:pr-10 max-lg:pr-20  text-right">
          <div className="text-7xl max-sm:text-5xl font-semibold drop-shadow-sm text-right font-primary text-white">
            <div className="underline decoration-orange-500">
              <span className="content-center">
                CAT
                <PawPrint
                  className={` inline-flex ${
                    selected.cat ? "motion-safe:animate-bounce" : ""
                  }`}
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Box */}
      <div
        onClick={() => selection("dog")}
        className={`second bg-cover bg-center border-orange-600 transition-all duration-300 cursor-pointer
              ${selected.dog ? "opacity-100 scale-105" : "opacity-50"}`}
      >
        <div className="max-w-4xl my-25 max-sm:pl-10 ml-auto mr-auto max-lg:pl-20 text-left">
          <div className="text-7xl max-sm:text-5xl font-semibold drop-shadow-sm font-primary text-white">
            <div className="underline decoration-orange-500 flex">
              <span className="content-center">
                DOG
                <PawPrint
                  className={` inline-flex ${
                    selected.dog ? "motion-safe:animate-bounce" : ""
                  }`}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdoptHeroSection;
