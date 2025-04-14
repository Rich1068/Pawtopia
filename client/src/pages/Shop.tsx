import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/PageHeader";
import serverAPI from "../helper/axios";
import type { IProduct } from "../types/Types";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import ShopContainer from "../components/shop/ShopPage/ShopContainer";
import toast from "react-hot-toast";

export const fetchProducts = async () => {
  try {
    const { data } = await serverAPI.get("/product/get-products");
    return data.data as IProduct[];
  } catch (error) {
    console.log("Fetch Products error: ", error);
    toast.error("Fetch Products error. Please try again later!");
    throw error;
  }
};

const Shop = () => {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });
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
