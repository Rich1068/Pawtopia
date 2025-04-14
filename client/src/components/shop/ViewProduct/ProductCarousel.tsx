import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "./productCarousel.css";
import { FC, useState, useRef } from "react";
import { IProduct } from "../../../types/Types";
import { getFullImageUrl } from "../../../helper/imageHelper";
import ImageModal from "../../ImageModal";

interface IProductCarousel {
  productData: IProduct | null;
}

export const ProductCarousel: FC<IProductCarousel> = ({ productData }) => {
  const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
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
          thumbs={{
            swiper:
              thumbsSwiper && thumbsSwiper.destroyed !== true
                ? thumbsSwiper
                : undefined,
          }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="max-h-100 mx-auto"
        >
          {hasPictures ? (
            pictures.map((img, i) => (
              <SwiperSlide key={i} className="max-h-auto m-auto relative">
                {/* Image wrapper */}
                <img
                  src={getFullImageUrl(img)}
                  onClick={() => handleImageClick(getFullImageUrl(img))}
                  onError={(e) => {
                    e.currentTarget.src = placeholderImage;
                  }}
                  alt="Pet"
                  className="border m-auto rounded-xl border-orange-500 object-contain !h-auto !w-100 !min-w-auto !max-h-100"
                />

                {/* Overlay for "Product not available" */}
                {productData?.isArchived && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
                    <span className="text-white font-primary font-semibold text-2xl sm:text-3xl md:text-4xl transform rotate-45 px-4 py-2 bg-black/50">
                      Product Not Available
                    </span>
                  </div>
                )}
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide className="!w-full relative">
              <img
                src="/assets/img/Logo1.png"
                alt="Placeholder Logo"
                className="border m-auto rounded-xl border-orange-500 object-contain !h-auto w-full !max-h-100"
              />
              {productData?.isArchived && (
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
                  <span className="text-white font-primary font-semibold text-2xl sm:text-3xl md:text-4xl transform rotate-45 px-4 py-2 bg-black/50">
                    Product Not Available
                  </span>
                </div>
              )}
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
            onSwiper={(swiper) => {
              if (swiper && swiper.el) {
                setThumbsSwiper(swiper);
              }
            }}
            spaceBetween={10}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper w-auto flex cursor-pointer"
            breakpoints={{
              0: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
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

      <ImageModal
        imageUrl={selectedImage}
        isOpen={!!selectedImage}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ProductCarousel;
