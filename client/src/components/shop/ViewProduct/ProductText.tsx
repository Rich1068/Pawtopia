import { FC, useState } from "react";
import type { IProduct } from "../../../types/Types";
import { Link, useNavigate } from "react-router";
import { Trash } from "lucide-react";
import serverAPI from "../../../helper/axios";
import toast from "react-hot-toast";
import WarningModal from "../../WarningModal";

const ProductText: FC<{ productData: IProduct }> = ({ productData }) => {
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
      <div className="p-6 bg-white rounded-2xl shadow-lg min-w-full min-h-full relative inline-block font-secondary border-2 border-orange-400 pb-20 break-words">
        {/* Product Name */}
        <h2 className="text-4xl font-bold mb-4 text-orange-600">{name}</h2>

        {/* Product Details */}
        <div className="text-gray-700 space-y-4">
          <p className="text-lg">
            <strong className="text-orange-500">Category:</strong>{" "}
            <div className="flex flex-wrap gap-2 w-full ">
              {category.map((cat) => (
                <span
                  key={cat}
                  className="bg-orange-400 text-white px-2 rounded flex items-center"
                >
                  {cat}
                </span>
              ))}
            </div>
          </p>
          <p className="text-lg">
            <strong className="text-orange-500">Price:</strong>{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(parseFloat(price))}
          </p>
          <p className="text-lg">
            <strong className="text-orange-500">Description:</strong>{" "}
            {description}
          </p>
        </div>
        <div className="absolute bottom-5 flex gap-x-4 ">
          <Link to={`/admin/product/edit/${productData._id}`}>
            <button className=" px-2 h-10 text-lg cursor-pointer hover:bg-orange-400 font-primary font-base border rounded-lg bg-orange-500 text-white">
              Edit Product
            </button>
          </Link>
          <button
            className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-md hover:bg-red-700 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Trash size={16} />
          </button>
        </div>
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
