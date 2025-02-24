import { Swiper, SwiperSlide } from 'swiper/react';
import {Autoplay, Pagination, Navigation } from 'swiper/modules';
import Card from './Card';
//@ts-expect-error typescript cant see this
import 'swiper/css';
//@ts-expect-error also this
import 'swiper/css/pagination';
//@ts-expect-error also this
import 'swiper/css/navigation';
import "./carousel.css";
export default function Carousel() {
    const images = [
        "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1598875184988-5e67b1a874b8?q=80&w=1921&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ];
        
  return (
    <div className='grid grid-cols-3'>
      <div className='col-span-2 flex justify-center'>
        <Swiper
            slidesPerView={3}
            slidesPerGroup={1}
            loop={true}
            centeredSlides={false}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 3000,
            }}
            navigation= {true}
            modules={[Autoplay, Pagination, Navigation]}
            className=""
          >
            {images.map((img) => 
               <SwiperSlide key={crypto.randomUUID()} className=""><img src={img} className='border-4 border-orange-600 max-h-100 max-w-80 rounded-xl'/></SwiperSlide>
            )}
            
          </Swiper>
      </div>
      <div className='m-auto w-auto'>
        <Card />
      </div>
      </div>
  );
}
