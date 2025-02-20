import {NavLink } from "react-router";
import { PawPrint } from "lucide-react";
import './AdoptHeroSection.css'
const AdoptHeroSection = () => {
    return (
        <>
            <NavLink to={'/adopt'}>
            <div className="first bg-center bg-cover border-5 border-orange-600 overflow-hidden max-sm:max-h-50%" >            
                <div className="max-w-4xl -mt-48 max-sm:mr-15 mr-25 ml-auto">
                    <h1 className="text-7xl max-sm:text-5xl font-semibold drop-shadow-sm text-right font-primary text-white">
                        <span className="underline decoration-orange-500">Cat<PawPrint className='motion-safe:animate-bounce left-0'/></span>
                    </h1>
                </div>
            </div>
            </NavLink>
            <NavLink to={'/adopt'}>
            <div className="second border-5 bg-cover bg-center border-orange-600">
                <div className="max-w-4xl my-25 max-sm:ml-15 ml-25 mr-auto text-left">
                    <div className="text-7xl max-sm:text-5xl font-semibold drop-shadow-sm font-primary text-white">
                        <div className="underline decoration-orange-500 flex"><span className='flex content-center pl-2'>DOG<PawPrint className='motion-safe:animate-bounce'/></span></div>
                    </div>
                </div>
            </div>
          </NavLink>
            
        </>
    )
}
export default AdoptHeroSection