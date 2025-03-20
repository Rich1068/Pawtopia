// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "./productCarousel.css";
import { FC, useState, useRef } from "react";
import { IProduct } from "../../../types/Types";
import ReactModal from "react-modal";
import { getFullImageUrl } from "../../../helper/imageHelper";

interface IProductCarousel {
  thumbsSwiper: SwiperClass | null;
  setThumbsSwiper: React.Dispatch<React.SetStateAction<SwiperClass | null>>;
  productData: IProduct | null;
}

export const PetCarousel: FC<IProductCarousel> = ({
  thumbsSwiper,
  setThumbsSwiper,
  productData,
}) => {
  const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pictures = productData?.images || [];
  const hasPictures = pictures.length > 0;
  const placeholderImage = "/assets/img/Logo1.png";

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
      <div className="max-w-160 w-[100%] max:lg:w-[90%] mx-auto lg:ml-auto">
        <Swiper
          onSwiper={setMainSwiper}
          spaceBetween={10}
          slidesPerView={1}
          thumbs={{ swiper: thumbsSwiper }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="max-h-100 h-auto w-auto mx-auto"
        >
          {hasPictures ? (
            pictures.map((img, i) => (
              <SwiperSlide key={i} className="max-h-auto m-auto">
                <img
                  src={getFullImageUrl(img)}
                  onClick={() => handleImageClick(getFullImageUrl(img))}
                  onError={(e) => {
                    e.currentTarget.src = placeholderImage;
                  }}
                  alt="Pet"
                  className="border m-auto rounded-xl border-orange-500 object-contain !h-auto !w-auto !max-h-100"
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide className="!w-full">
              <img
                src="/assets/img/Logo1.png"
                alt="Placeholder Logo"
                className="border rounded-xl border-orange-500 object-contain !h-auto !w-auto"
              />
            </SwiperSlide>
          )}
        </Swiper>
        <div className="flex max-w-140 py-4 mx-auto">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            data-testid="prev-button"
          >
            <ChevronLeft className="text-orange-500 cursor-pointer" />
          </button>
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper w-auto flex cursor-pointer"
            breakpoints={{
              0: { slidesPerView: 3 }, // For mobile screens
              768: { slidesPerView: 4 }, // For larger screens (tablet and above)
            }}
          >
            {hasPictures ? (
              pictures.map((img, i) => (
                <SwiperSlide
                  key={i}
                  className="my-auto min-w-20"
                  onMouseEnter={() => handleThumbnailHover(i)}
                >
                  <img
                    src={getFullImageUrl(img)}
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
        className="p-6 focus:outline-none rounded-lg shadow-lg w-[100%] max-w-2xl mx-auto z-999"
        overlayClassName="fixed inset-0 bg-black/75 flex justify-center items-center z-999"
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
            src={selectedImage!}
            alt="Large preview"
            className="max-w-full max-h-[90vh] rounded-lg object-contain"
          />
        </div>
      </ReactModal>
    </>
  );
};

export default PetCarousel;
