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

  const pictures = petData?.relationships?.pictures?.data || [];
  const hasPictures = pictures.length > 0;

  const placeholderImage = "/assets/img/Logo1.png";

  const getImageUrl = (index: number) => {
    const url =
      petData?.attributes.pictureThumbnailUrl && pictures[index]
        ? `${cleanImageUrl(petData.attributes.pictureThumbnailUrl)}/${
            pictures[index].id
          }.jpg`
        : placeholderImage;
    return url;
  };

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

  const swiperRef = useRef<SwiperClass | undefined>(undefined);
  return (
    <>
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
          {hasPictures ? (
            pictures.map((_, i) => (
              <SwiperSlide key={i} className="!w-full m-auto">
                <img
                  src={getImageUrl(i)}
                  onClick={() => handleImageClick(getImageUrl(i))}
                  onError={(e) => (e.currentTarget.src = placeholderImage)}
                  alt="Pet"
                  className="border rounded-xl border-orange-500 object-contain !h-auto !w-auto !max-h-125"
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide className="!w-full m-auto">
              <img
                src="/assets/img/Logo1.png"
                alt="Placeholder Logo"
                className="border rounded-xl border-orange-500 object-contain !h-auto !w-auto !max-h-125"
              />
            </SwiperSlide>
          )}
        </Swiper>
        <div className="flex">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            data-testid="prev-button"
          >
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
            {hasPictures ? (
              pictures.map((_, i) => (
                <SwiperSlide
                  key={i}
                  className="my-auto"
                  onMouseEnter={() => handleThumbnailHover(i)}
                >
                  <img
                    src={getImageUrl(i)}
                    className="border rounded-md border-orange-500"
                    onError={(e) => (e.currentTarget.src = placeholderImage)}
                    alt="Thumbnail"
                  />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide className="my-auto">
                <img
                  src="/assets/img/Logo1.png"
                  className="border rounded-md border-orange-500"
                  alt="Placeholder Thumbnail"
                />
              </SwiperSlide>
            )}
          </Swiper>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            data-testid="next-button"
          >
            <ChevronRight className="text-orange-500 cursor-pointer" />
          </button>
        </div>
      </div>

      <ReactModal
        isOpen={!!selectedImage}
        ariaHideApp={false}
        onRequestClose={handleCloseModal}
        className="p-6 focus:outline-none rounded-lg shadow-lg w-[100%] max-w-2xl mx-auto"
        overlayClassName="fixed inset-0 bg-black/75 flex justify-center items-center z-50"
      >
        <div className="relative flex justify-center items-center">
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-2 right-2 text-white text-2xl"
            data-testid="close-modal-button"
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
