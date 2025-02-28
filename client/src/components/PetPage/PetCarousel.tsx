// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "./petpage.css";
import { Key, FC, useState, useRef } from "react";
import { Pet } from "../../types/Types";

interface IPetCarousel {
  thumbsSwiper: SwiperClass | null;
  setThumbsSwiper: React.Dispatch<React.SetStateAction<SwiperClass | null>>;
  petData: Pet | null;
}
export const PetCarousel: FC<IPetCarousel> = ({
  thumbsSwiper,
  setThumbsSwiper,
  petData,
}) => {
  const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const swiperRef = useRef<SwiperClass>();
  return (
    <>
      {petData && petData.photoUrls.length > 0 ? (
        <div className="max-w-140 w-[100%] max:lg:w-[90%] max-sm:w-[80%] mx-auto">
          <Swiper
            onSwiper={setMainSwiper}
            loop={true}
            spaceBetween={10}
            slidesPerView={1}
            thumbs={{ swiper: thumbsSwiper }}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="inherit mySwiper2 max-h-200  border border-orange-500 rounded-xl"
          >
            {petData.photoUrls.map(
              (url: string, index: Key | null | undefined) => (
                <SwiperSlide key={index} className="!w-[100%]">
                  <img src={url} alt={"picture"} className="w-dvw" />
                </SwiperSlide>
              )
            )}
          </Swiper>
          <div className="flex">
            <button onClick={() => swiperRef.current?.slidePrev()}>
              <ChevronLeft className="text-orange-500 cursor-pointer" />
            </button>
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              // style={
              //   {
              //     "--swiper-navigation-width": "40px",
              //     "--swiper-navigation-size": "25px",
              //     "--swiper-navigation-color": "oklch(0.705 0.213 47.604)",
              //   } as React.CSSProperties
              // }
              className="mySwiper max-h-180 w-full max-w-140 cursor-pointer "
            >
              {petData.photoUrls.map(
                (url: string, index: Key | null | undefined) => (
                  <SwiperSlide
                    key={index}
                    className="border rounded-xl border-orange-500"
                    onMouseEnter={() => mainSwiper?.slideTo(index as number)}
                  >
                    <img src={url} />
                  </SwiperSlide>
                )
              )}
            </Swiper>
            <button onClick={() => swiperRef.current?.slideNext()}>
              <ChevronRight className="text-orange-500 cursor-pointer" />
            </button>
          </div>
        </div>
      ) : (
        <p>Loading pet data...</p>
      )}
    </>
  );
};

export default PetCarousel;
