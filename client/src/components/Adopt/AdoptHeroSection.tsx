import { PawPrint } from "lucide-react";
import './AdoptHeroSection.css'
import { useRef, useState } from "react";
import toast from "react-hot-toast";
const AdoptHeroSection = () => {
    const toastShown = useRef(false); 
    const [selected, setSelected] = useState<{first:boolean; second: boolean}>({
        first: true,
        second: true,
    });
    const selection = (item: "first" | "second") => {
        setSelected((prev) => {
            const newState = {...prev, [item]: !prev[item] };
            if (!newState.first && !newState.second) {

                newState[item] = true; 
                if (!toastShown.current) { // Prevent multiple toasts
                    toast.error("At least one option must remain selected", { position: "top-center" });
                    toastShown.current = true;
    
                    // Reset after a short delay so it can trigger again if needed
                    setTimeout(() => {
                        toastShown.current = false;
                    }, 2000);
                }
            }
            return newState
        })
    }
    
    return (
        <div className="flex flex-col gap-5 relative overflow-hidden">
          {/* First Box */}
          <div
            onClick={() => selection("first")}
            className={`first bg-center bg-cover border-5 border-orange-600 transition-all duration-300 cursor-pointer 
              ${selected.first ? " opacity-100 scale-105" : "opacity-50"}`}
          >
              <div className="max-w-4xl -mt-46 ml-auto mr-auto max-sm:pr-10 max-lg:pr-20  text-right">
                <div className="text-7xl max-sm:text-5xl font-semibold drop-shadow-sm text-right font-primary text-white">
                  <div className="underline decoration-orange-500">
                    <span className="content-center">
                      CAT
                      <PawPrint className={` inline-flex ${selected.first ? "motion-safe:animate-bounce" : ""}`} />
                    </span>
                  </div>
                </div>
              </div>
          </div>
    
          {/* Second Box */}
          <div
            onClick={() => selection("second")}
            className={`second bg-cover bg-center border-orange-600 transition-all duration-300 cursor-pointer
              ${selected.second ? "opacity-100 scale-105" : "opacity-50"}`}
          >
              <div className="max-w-4xl my-25 max-sm:pl-10 ml-auto mr-auto max-lg:pl-20 text-left">
                <div className="text-7xl max-sm:text-5xl font-semibold drop-shadow-sm font-primary text-white">
                  <div className="underline decoration-orange-500 flex">
                    <span className="content-center">
                      DOG
                      <PawPrint className={` inline-flex ${selected.second ? "motion-safe:animate-bounce" : ""}`} />
                    </span>
                  </div>
                </div>
              </div>
          </div>
        </div>
      );
    }
export default AdoptHeroSection