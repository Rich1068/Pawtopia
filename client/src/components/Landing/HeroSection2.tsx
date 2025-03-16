import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export const HeroSection2 = () => {
  return (
    <>
      <div className="w-full ">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 43.9999C106.667 43.9999 213.333 7.99994 320 7.99994C426.667 7.99994 533.333 43.9999 640 43.9999C746.667 43.9999 853.333 7.99994 960 7.99994C1066.67 7.99994 1173.33 43.9999 1280 43.9999C1386.67 43.9999 1440 19.0266 1440 9.01329V100H0V43.9999Z"
            className="fill-current text-white"
          ></path>
        </svg>
      </div>
      <section className="relative bg-white  max-w-[100%] m-auto">
        <div className="relative grid max-w-screen-xl max-sm:px-8 sm:px-12 mx-auto lg:gap-8 xl:gap-0 lg:py-10 lg:grid-cols-12 max-lg:py-5">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-primary font-semibold text-orange-600 tracking-tight leading-tight md:text-5xl xl:text-6xl">
              Adopt & Shop – Give Your Pet the Best Start
            </h1>
            <p className="max-w-2xl mb-6 font-secondary text-amber-950 lg:mb-8 md:text-lg lg:text-xl">
              Bringing home a new furry friend is just the beginning of a
              beautiful journey. Make sure they have everything they need with
              our selection of high-quality pet food, toys, and essentials.
              Whether you're adopting or already have a pet, we've got you
              covered. Start shopping now and give your pet the love and care
              they deserve!
            </p>

            <div className="flex flex-wrap gap-4 max-sm:justify-center">
              <Link
                to="/adopt"
                className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 focus:ring-4 focus:ring-orange-400 transition-all duration-300"
              >
                Find a Pet
                <ArrowRight
                  className="pl-2 animate-[bounce-right_2s_infinite]"
                  size={30}
                />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-orange-600 border-2 border-orange-600 rounded-lg hover:bg-orange-500 hover:text-white focus:ring-4 focus:ring-orange-400 transition-all duration-300"
              >
                Visit Our Store
              </Link>
            </div>
          </div>
          <div className="max-lg:hidden col-span-5 pl-4 z-10 items-end justify-end">
            <img
              src="/assets/img/dogfood.png"
              alt="dogfood"
              className="object-contain drop-shadow-lg w-fit"
            />
          </div>
        </div>
      </section>
      <div className="w-full rotate-180">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 43.9999C106.667 43.9999 213.333 7.99994 320 7.99994C426.667 7.99994 533.333 43.9999 640 43.9999C746.667 43.9999 853.333 7.99994 960 7.99994C1066.67 7.99994 1173.33 43.9999 1280 43.9999C1386.67 43.9999 1440 19.0266 1440 9.01329V100H0V43.9999Z"
            className="fill-current text-white"
          ></path>
        </svg>
      </div>
    </>
  );
};

export default HeroSection2;
