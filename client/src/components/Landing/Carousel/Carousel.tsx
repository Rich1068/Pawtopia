/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Card from "./Card";

import "swiper/css";
import "swiper/css/navigation";
import "./carousel.css";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carousel() {
  const images = [
    "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1598875184988-5e67b1a874b8?q=80&w=1921&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  //@ts-ignore
  const swiperRef = useRef<SwiperClass>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 items-center py-6 mx-10">
      {/* Swiper Section */}
      <div className="col-span-2 flex items-center justify-center w-full ">
        {/* Left Button - Hidden on Small Screens */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="hidden sm:flex"
        >
          <ChevronLeft className="text-orange-500 cursor-pointer w-6 h-6 sm:w-8 sm:h-8 max-sm:mx-5" />
        </button>

        {/* Swiper */}
        <Swiper
          slidesPerView={1}
          slidesPerGroup={1}
          loop={true}
          centeredSlides={false}
          autoplay={{
            delay: 3000,
          }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          navigation={true}
          modules={[Autoplay, Navigation]}
          breakpoints={{
            320: { slidesPerView: 1 },
            480: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1300: { slidesPerView: 3 },
          }}
          className="w-full"
        >
          {images.map((img) => (
            <SwiperSlide
              key={crypto.randomUUID()}
              className="flex justify-center"
            >
              <img
                src={img}
                className="border-4 border-orange-600 rounded-xl max-[641]:!w-[40%] max-lg:!w-[60%] w-full lg:max-w-sm h-auto object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Right Button - Hidden on Small Screens */}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="hidden sm:flex"
        >
          <ChevronRight className="text-orange-500 cursor-pointer w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Card Section */}
      <div className="flex justify-center">
        <Card />
      </div>
    </div>
  );
}
