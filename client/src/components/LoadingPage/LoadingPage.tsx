import "./loading.css";
import { motion } from "motion/react";
import { FC } from "react";

interface LoadingPageProps {
  fadeOut: boolean;
}

const LoadingPage: FC<LoadingPageProps> = ({ fadeOut }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 flex flex-col-reverse items-center justify-center w-full h-full bg-white z-[9999]"
    >
      <div className="font-primary pt-5 text-amber-950 text-2xl">
        Loading...
      </div>
      <div className="dog">
        {/* Dog Paws */}
        <div className="dog__paws">
          <div className="dog__bl-leg leg">
            <div className="dog__bl-paw paw"></div>
            <div className="dog__bl-top top"></div>
          </div>
          <div className="dog__fl-leg leg">
            <div className="dog__fl-paw paw"></div>
            <div className="dog__fl-top top"></div>
          </div>
          <div className="dog__fr-leg leg">
            <div className="dog__fr-paw paw"></div>
            <div className="dog__fr-top top"></div>
          </div>
        </div>

        {/* Dog Body */}
        <div className="dog__body">
          <div className="dog__tail"></div>
        </div>

        {/* Dog Head */}
        <div className="dog__head">
          <div className="dog__snout">
            <div className="dog__nose"></div>
            <div className="dog__eyes">
              <div className="dog__eye-l"></div>
              <div className="dog__eye-r"></div>
            </div>
          </div>
        </div>

        {/* Dog Ears */}
        <div className="dog__head-c">
          <div className="dog__ear-l"></div>
          <div className="dog__ear-r"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingPage;
