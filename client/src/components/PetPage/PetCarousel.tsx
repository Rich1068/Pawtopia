// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "./petpage.css";
import { FC, useState, useRef } from "react";
import { petType } from "../../types/pet";
import ReactModal from "react-modal";

interface IPetCarousel {
  thumbsSwiper: SwiperClass | null;
  setThumbsSwiper: React.Dispatch<React.SetStateAction<SwiperClass | null>>;
  petData: petType | null;
  cleanImageUrl: (url: string | undefined) => string | undefined;
}
export const PetCarousel: FC<IPetCarousel> = ({
  thumbsSwiper,
  setThumbsSwiper,
  petData,
  cleanImageUrl,
}) => {
  const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleThumbnailHover = (index: number) => {
    if (mainSwiper) {
      setTimeout(() => {
        mainSwiper.slideTo(index);
      }, 100); // 100ms delay to prevent flickering
    }
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const swiperRef = useRef<SwiperClass>();
  return (
    <>
      {petData && (petData?.relationships?.pictures?.data ?? []).length > 0 ? (
        <div className="max-w-140 w-[100%] max:lg:w-[90%] max-sm:w-[80%] mx-auto">
          <Swiper
            onSwiper={setMainSwiper}
            spaceBetween={10}
            slidesPerView={1}
            thumbs={{ swiper: thumbsSwiper }}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="inherit mySwiper2 max-h-125 w-auto"
          >
            {petData?.relationships?.pictures?.data.map((url, i: number) => (
              <SwiperSlide key={i} className="!w-full  m-auto">
                <img
                  src={
                    petData.attributes.pictureThumbnailUrl
                      ? cleanImageUrl(petData.attributes.pictureThumbnailUrl) +
                        (petData.relationships?.pictures?.data?.[i]?.id
                          ? `/${petData.relationships.pictures.data[i].id}.jpg`
                          : "")
                      : "assets/img/Logo1.png"
                  }
                  onClick={() =>
                    handleImageClick(
                      petData.attributes.pictureThumbnailUrl
                        ? cleanImageUrl(
                            petData.attributes.pictureThumbnailUrl
                          ) +
                            (petData.relationships?.pictures?.data?.[i]?.id
                              ? `/${petData.relationships.pictures.data[i].id}.jpg`
                              : "")
                        : "assets/img/Logo1.png"
                    )
                  }
                  alt={"picture"}
                  className=" border rounded-xl border-orange-500 object-contain !h-auto !w-auto !max-h-125"
                />
              </SwiperSlide>
            ))}
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
              className="mySwiper max-h-180 w-full max-w-140 cursor-pointer"
            >
              {petData?.relationships?.pictures?.data.map((url, i: number) => (
                <SwiperSlide
                  key={i}
                  className="my-auto"
                  onMouseEnter={() => handleThumbnailHover(i)}
                >
                  <img
                    src={
                      petData.attributes.pictureThumbnailUrl
                        ? cleanImageUrl(
                            petData.attributes.pictureThumbnailUrl
                          ) +
                          (petData.relationships?.pictures?.data?.[i]?.id
                            ? `/${petData.relationships.pictures.data[i].id}.jpg`
                            : "") // Only add if ID exists
                        : "assets/img/Logo1.png"
                    }
                    className="border rounded-md border-orange-500"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <button onClick={() => swiperRef.current?.slideNext()}>
              <ChevronRight className="text-orange-500 cursor-pointer" />
            </button>
          </div>
        </div>
      ) : (
        <p>Loading pet data...</p>
      )}

      <ReactModal
        isOpen={!!selectedImage}
        ariaHideApp={false}
        onRequestClose={handleCloseModal}
        className="p-6 rounded-lg shadow-lg w-[100%] max-w-2xl mx-auto"
        overlayClassName="fixed inset-0 bg-black/75 flex justify-center items-center z-50"
      >
        <div className="relative flex justify-center items-center">
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-2 right-2 text-white text-2xl"
          >
            <X size={30} />
          </button>

          {/* Centered Image */}
          <img
            src={selectedImage || ""}
            alt="Large preview"
            className="max-w-full max-h-[90vh] rounded-lg object-contain"
          />
        </div>
      </ReactModal>
    </>
  );
};

export default PetCarousel;
