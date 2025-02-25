
import Marquee from "react-fast-marquee"
const CenterText = ()=> {
    return (
        <>
        <section className= "bg-[url(/assets/img/wallpaper.jpg)] relative bg-fixed bg-center bg-cover bg-no-repeat">
            <div className=" px-4 mx-auto max-w-screen-xl text-center lg:pt-16 lg:px-12">
                <h1 className="mb-4 text-4xl font-semibold tracking-tight leading-none font-primary text-orange-600 md:text-5xl lg:text-6xl">Get Your Pet Here at Pawtopia</h1>
                <p className="mb-8 text-lg font-normal font-secondary text-gray-500 lg:text-xl sm:px-16 xl:px-48">Find healthy, happy, and well-cared-for pets ready to join your family. Quality, love, and companionship—only at Pawtopia!</p>
                <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
                    <span className="font-semibold font-secondary text-amber-950 uppercase">IN PARTNERSHIP WITH</span>
                </div> 
            </div>
            <div className="relative flex overflow-x-hidden w-full">
                        <div className="py-12 min-w-full whitespace-nowrap">   
                            <Marquee autoFill={true}>
                            <a href="https://www.pedigree.com/" target="_blank" className="mr-5 mb-5 lg:mb-0 hover:text-gray-800">
                                <img className="h-30 pr-30" src="/assets/img/Pedigree-Logo-2007.png" alt="pedigree"/>                    
                            </a>
                            <a href="https://www.royalcanin.com/ph" target="_blank" className="mr-5 mb-5 lg:mb-0 hover:text-gray-800">
                                <img className="h-30 pr-30" src="/assets/img/Royal-Canin-Logo.png" alt="Royal Canin"/>                    
                            </a>
                            <a href="https://www.purina.com/" target="_blank" className="mr-5 mb-5 lg:mb-0 hover:text-gray-800">
                                <img className="h-30 pr-30" src="/assets/img/Purina-Logo.png" alt="Purina"/>                    
                            </a> 
                            <a href="https://paws.org.ph/" target="_blank" className="mr-5 mb-5 lg:mb-0 hover:text-gray-800">
                                <img className="h-30 pr-30" src="/assets/img/PAWS-New-Logo.png" alt="PAWS"/>                    
                            </a> 
                            </Marquee>
                        </div>      
                    </div>
        </section>
        </>
    )
}

export default CenterText