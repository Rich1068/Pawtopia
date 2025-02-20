import {PawPrint} from 'lucide-react'
import { Link } from 'react-router';
export const HeroSection = () => {
    return (
      <section className="relative h-[500px] bg-cover bg-center flex bg-[url('https://www.petside.com/wp-content/uploads/2021/01/Happy-Dog.jpg')] items-center text-white" >
        <div className="max-w-4xl lg:mx-45 text-left max-lg:mx-20">
          <h1 className="text-4xl md:text-7xl font-semibold drop-shadow-sm font-primary ">
            <span className="underline decoration-orange-500">Adopt</span> a Loving 
            <br />Pet Today!
          </h1>
          <p className="mt-4 text-lg font-medium drop-shadow-lg font-secondary">
            Find your perfect furry companion and give them a forever home.
          </p>
          <Link to='/adopt' className='className=" rounded-lg mt-6 inline-block px-4 py-3 text-xl font-medium font-primary bg-orange-600 hover:bg-orange-500 text-white'><div className='flex'>View Pets <span className='content-center pl-2'><PawPrint className='motion-safe:animate-bounce'/></span></div></Link>
        </div>
      </section>
    );
  };
  
  export default HeroSection;
  