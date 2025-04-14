import { FC, useState } from "react";
import type { IProduct } from "../../../types/Types";
import { useNavigate } from "react-router";
import serverAPI from "../../../helper/axios";
import toast from "react-hot-toast";
import WarningModal from "../../WarningModal";
import AdminButtons from "./AdminButtons";
import UserButtons from "./UserButtons";

interface IProductText {
  productData: IProduct;
  isAdmin: boolean;
  isAdminView: boolean;
}
const ProductText: FC<IProductText> = ({
  productData,
  isAdmin,
  isAdminView,
}) => {
  const { name, description, category, price } = productData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      await serverAPI.delete(`/product/${productData._id}`, {
        withCredentials: true,
      });
      setIsModalOpen(false);
      navigate("/admin/product-list");
      toast.success("Product Successfully Deleted");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Error deleting product. Please try again.");
    }
  };
  return (
    <>
      <div
        className={`p-6 bg-white rounded-2xl max-lg:mx-auto lg:!mr-auto shadow-lg min-w-full md:min-w-[90%] min-h-auto relative inline-block font-secondary border-2 border-orange-400 ${
          isAdmin && isAdminView ? "pb-20" : "pb-35"
        } w-full text-wrap break-words`}
      >
        {/* Product Name */}
        <h2 className="text-4xl font-semibold mb-4 text-orange-600 font-primary">
          {name} {productData.isArchived && "(Not Available)"}
        </h2>

        {/* Product Details */}
        <div className="text-gray-700 space-y-4 text-lg">
          <strong className="text-orange-500">Category:</strong>{" "}
          <div className="flex flex-wrap gap-2 w-full text-base">
            {category.map((cat) => (
              <span
                key={cat}
                className="bg-orange-400 text-white px-2 rounded flex items-center"
              >
                {cat}
              </span>
            ))}
          </div>
          <div>
            <strong className="text-orange-500 text-lg">Price:</strong>
            <div className="text-base">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(parseFloat(price))}
            </div>
          </div>
          <div>
            <strong className="text-orange-500 text-lg">Description:</strong>
            <div className="text-base">{description}</div>
          </div>
        </div>
        {isAdmin && isAdminView ? (
          <div className="absolute bottom-5 flex gap-x-4 ">
            <AdminButtons
              productId={productData._id}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
        ) : (
          <div className="absolute bottom-5">
            <UserButtons product={productData} />
          </div>
        )}
      </div>
      <WarningModal
        header="Confirm Deletion"
        text={`Are you sure you want to delete "${productData.name}"?`}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </>
  );
};

export default ProductText;
