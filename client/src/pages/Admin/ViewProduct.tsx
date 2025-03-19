import { useEffect, useState } from "react";
import serverAPI from "../../helper/axios";
import { IProduct } from "../../types/Types";
import { useParams } from "react-router";
import ProductCarousel from "../../components/shop/ViewProduct/ProductCarousel";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { SwiperClass } from "swiper/react";
import ProductText from "../../components/shop/ViewProduct/ProductText";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await serverAPI.get(`/product/${id}`);
      setProduct(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);
  if (loading) {
    return <LoadingPage fadeOut={false} />;
  }

  if (!product) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-10 text-center bg-fixed bg-center bg-cover bg-no-repeat bg-[url(/assets/img/wallpaper.jpg)] text-orange-600 shadow-md rounded-lg mx-4">
          <FontAwesomeIcon icon={faPaw} size="3x" />
          <h2 className="text-3xl font-semibold font-primary">
            Product Not Found
          </h2>
          <p className="text-gray-600 mt-2 font-secondary">
            The product you're looking for doesn't exist
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="">
        <div className="mx-auto rounded-t-xl bg-fixed bg-center bg-cover bg-no-repeat bg-[url(/assets/img/wallpaper.jpg)] p-4 h-full w-full flex max-md:flex-col">
          <div className="flex-1 min-w-[50%] flex justify-center">
            <ProductCarousel
              thumbsSwiper={thumbsSwiper}
              setThumbsSwiper={setThumbsSwiper}
              productData={product}
            />
          </div>

          <div className="flex-1 min-w-[50%] flex justify-center">
            <ProductText productData={product} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProduct;
