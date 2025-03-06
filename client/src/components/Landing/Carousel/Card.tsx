import { Link } from "react-router";

const Card = () => {
  return (
    <div className="p-5 bg-white border-[6px] max-h-100 h-dvh max-w-100 border-orange-500 shadow-[12px_12px_0_#ff6900] rounded-xl m-10">
      <div className="m-auto xl:mt-10 h-auto w-auto">
        <span className="block relative overflow-hidden text-4xl max-md:text-2xl font-primary font-semibold uppercase text-orange-600 mb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[90%] after:h-[3px] after:bg-orange-500 after:translate-x-[-100%] after:transition-transform after:duration-300 hover:after:translate-x-0">
          Available for Adoption
        </span>
        <p className="text-xl max-md:text-lg font-secondary leading-relaxed text-amber-950 mb-5">
          Give a loving home to a pet in need. Find your perfect companion
          today!
        </p>
        <div className="flex flex-col gap-4">
          <Link to={"/adopt"}>
            <button className="cursor-pointer relative w-1/2 rounded-md h-full px-4 py-2 text-lg font-bold uppercase text-amber-950 border-2 border-orange-500 overflow-hidden transition-transform duration-300 active:scale-95 before:content-['ADOPT_NOW'] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:flex before:items-center before:justify-center before:bg-orange-600 before:text-white before:translate-y-full before:transition-transform before:duration-300 hover:before:translate-y-0">
              ADOPT NOW
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Card;
