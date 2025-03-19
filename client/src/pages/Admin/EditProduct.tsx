import { useEffect, useState } from "react";
import { useParams } from "react-router";
import serverAPI from "../../helper/axios";
import AddProduct from "./AddProducts";
import type { IAddProduct } from "../../types/Types";

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IAddProduct | null>(null);

  const fetchProduct = async () => {
    try {
      const res = await serverAPI.get(`/product/${id}`, {
        withCredentials: true,
      });
      setProduct(res.data.data);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return <AddProduct productToEdit={product} onRefresh={fetchProduct} />;
};

export default EditProduct;
