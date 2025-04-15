import PageHeader from "../components/PageHeader";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import ShopContainer from "../components/shop/ShopPage/ShopContainer";
import { useShopList } from "../hooks/useProducts";

const Shop = () => {
  const { data: allProducts = [], isLoading } = useShopList();
  if (isLoading) return <LoadingPage fadeOut={false} />;

  return (
    <>
      <div className="min-h-screen flex flex-col bg-orange-600">
        <PageHeader text="Shop" />
        <div className="flex flex-row rounded-t-xl">
          <ShopContainer allProducts={allProducts} />
        </div>
      </div>
    </>
  );
};

export default Shop;
