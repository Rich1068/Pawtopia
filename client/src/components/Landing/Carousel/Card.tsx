import "./card.css"
const Card = () => {
    return (
    <div className=" p-5 bg-white border-[6px] border-orange-500 shadow-[12px_12px_0_#ff6900]">
        <span className="block relative overflow-hidden text-2xl font-primary font-semibold uppercase text-orange-600 mb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[90%] after:h-[3px] after:bg-orange-500 after:translate-x-[-100%] after:transition-transform after:duration-300 hover:after:translate-x-0">
            Available for Sale
        </span>
        <p className="text-base font-secondary leading-relaxed text-dark mb-5">
            Get existential crisis delivered straight to your inbox every week.
        </p>
        <div className="flex flex-col gap-4">
            <button className="relative w-1/2 h-full px-4 py-2 text-lg font-bold uppercase text-dark border-2 border-orange-500 overflow-hidden transition-transform duration-300 active:scale-95 before:content-['BUY_NOW'] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:flex before:items-center before:justify-center before:bg-orange-600 before:text-white before:translate-y-full before:transition-transform before:duration-300 hover:before:translate-y-0">
                BUY NOW
            </button>
        </div>
    </div>
    )
}
export default Card