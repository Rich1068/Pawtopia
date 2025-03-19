import { Eye, Edit, Trash } from "lucide-react";
import { Link } from "react-router";
import type { IProduct } from "../../../../types/Types";
import { useState } from "react";
import WarningModal from "../../../WarningModal";
import serverAPI from "../../../../helper/axios";
import toast from "react-hot-toast";

const ProductActionButtons = ({
  product,
  onDelete,
}: {
  product: IProduct;
  onDelete: (productId: string) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDelete = async () => {
    try {
      await serverAPI.delete(`/product/${product._id}`, {
        withCredentials: true,
      });
      onDelete(product._id);
      setIsModalOpen(false);
      toast.success("Product Successfully Deleted");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Error deleting product. Please try again.");
    }
  };
  return (
    <div className="flex gap-2 justify-center">
      <Link to="/admin/product/:id">
        <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700">
          <Eye size={16} />
        </button>
      </Link>
      <Link to="/admin/product/:id">
        <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-700">
          <Edit size={16} />
        </button>
      </Link>
      <button
        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700"
        onClick={() => setIsModalOpen(true)}
      >
        <Trash size={16} />
      </button>
      <WarningModal
        header="Confirm Deletion"
        text={`Are you sure you want to delete "${product.name}"?`}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ProductActionButtons;
