import { useParams, useNavigate } from "react-router";
import AddProduct from "./AddProducts";
import { useProduct } from "../../hooks/useProducts";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import WarningContainer from "../../components/WarningContainer";

const EditProduct = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const navigate = useNavigate();
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
  return <AddProduct productToEdit={product} onRefresh={refetch} />;
};

export default EditProduct;
