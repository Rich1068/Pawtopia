import { useEffect, useState } from "react";
import serverAPI from "../../helper/axios";
import { IProduct } from "../../types/Types";
import { useParams, useNavigate } from "react-router";
import ProductCarousel from "../../components/shop/ViewProduct/ProductCarousel";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { SwiperClass } from "swiper/react";
import ProductText from "../../components/shop/ViewProduct/ProductText";
import WarningContainer from "../../components/WarningContainer";
import TitleComponent from "../../components/shop/Admin/TitleComponent";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router";
import PageHeader from "../../components/PageHeader";

const ViewProduct = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === "admin";
  const isAdminView = location.pathname.startsWith("/admin");
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const navigate = useNavigate();

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await serverAPI.get(`/product/${id}`);
      setProduct(res.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
      <WarningContainer
        header="Product Not Found"
        text="The product you're looking for doesn't exist"
        confirmText="Back"
        onConfirm={() => navigate(-1)}
      />
    );
  }

  return (
    <>
      {isAdmin && isAdminView ? (
        <TitleComponent text="View Product" />
      ) : (
        <PageHeader text="Product Details" />
      )}

      <div className="sm:p-4 rounded-xl h-full">
        <div className="relative mx-auto rounded-t-xl p-4 w-full flex max-lg:flex-col gap-x-4 items-stretch">
          <div className="flex-1 min-w-[50%] flex flex-col">
            <ProductCarousel
              thumbsSwiper={thumbsSwiper}
              setThumbsSwiper={setThumbsSwiper}
              productData={product}
            />
          </div>

          <div className="flex-1 min-w-[50%] flex flex-col lg:pr-8">
            <ProductText
              productData={product}
              isAdmin={isAdmin}
              isAdminView={isAdminView}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProduct;
