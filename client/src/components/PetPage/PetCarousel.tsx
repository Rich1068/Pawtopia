// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "./petpage.css";
import { Key, FC } from "react";
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
  return (
    <>
      {petData && petData.photoUrls.length > 0 ? (
        <div>
          <Swiper
            loop={true}
            spaceBetween={10}
            slidesPerView={1}
            thumbs={{ swiper: thumbsSwiper }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper2 max-h-100 max-w-100 border"
          >
            {petData.photoUrls.map(
              (url: string, index: Key | null | undefined) => (
                <SwiperSlide key={index}>
                  <img src={url} alt={"picture"} />
                </SwiperSlide>
              )
            )}
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            navigation={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            style={
              {
                "--swiper-navigation-width": "40px",
                "--swiper-navigation-size": "25px",
                "--swiper-navigation-color": "oklch(0.705 0.213 47.604)",
              } as React.CSSProperties
            }
            className="mySwiper max-h-80 max-w-100 cursor-pointer "
          >
            {petData.photoUrls.map(
              (url: string, index: Key | null | undefined) => (
                <SwiperSlide key={index} className="border">
                  <img src={`${url}`} />
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
      ) : (
        <p>Loading pet data...</p>
      )}
    </>
  );
};

export default PetCarousel;
