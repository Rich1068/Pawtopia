import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/PageHeader";
import serverAPI from "../helper/axios";
import type { IProduct } from "../types/Types";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import ShopContainer from "../components/shop/ShopPage/ShopContainer";

const fetchProducts = async () => {
  try {
    const { data } = await serverAPI.get("/product/get-products");
    return data.data as IProduct[];
  } catch (error) {
    console.log("FetchPets error: ", error);
  }
};

const Shop = () => {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  if (isLoading) return <LoadingPage fadeOut={false} />;

  return (
    <>
      <div className="min-h-screen flex flex-col bg-orange-600">
        <PageHeader text="Shop" />
        <div className="flex flex-row rounded-t-xl bg-white">
          <ShopContainer allProducts={allProducts} />
        </div>
      </div>
    </>
  );
};

export default Shop;
