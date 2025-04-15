import { useParams, useNavigate } from "react-router";
import ProductCarousel from "../../components/shop/ViewProduct/ProductCarousel";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import ProductText from "../../components/shop/ViewProduct/ProductText";
import WarningContainer from "../../components/WarningContainer";
import TitleComponent from "../../components/shop/Admin/TitleComponent";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router";
import PageHeader from "../../components/PageHeader";
import { useProduct } from "../../hooks/useProducts";

const ViewProduct = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === "admin";
  const isAdminView = location.pathname.startsWith("/admin");
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useProduct(id);

  if (isLoading) {
    return <LoadingPage fadeOut={false} />;
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen">
        <WarningContainer
          header="Product Not Found"
          text="The product you're looking for doesn't exist"
          confirmText="Back"
          onConfirm={() => navigate(-1)}
        />
      </div>
    );
  }

  return (
    <>
      {isAdmin && isAdminView ? (
        <TitleComponent text="View Product" />
      ) : (
        <PageHeader text="Product Details" />
      )}
      <div className={`${!isAdminView ? "bg-orange-600" : null}`}>
        <div className="sm:p-4 h-full min-h-screen w-full bg-fixed bg-center bg-cover bg-no-repeat bg-[url(/assets/img/wallpaper.jpg)] rounded-t-xl">
          <div className="relative mx-auto rounded-t-xl p-4 w-full flex max-lg:flex-col gap-x-4 items-stretch">
            <div className="flex-1 min-w-[50%] flex flex-col">
              <ProductCarousel productData={product} />
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
      </div>
    </>
  );
};

export default ViewProduct;
