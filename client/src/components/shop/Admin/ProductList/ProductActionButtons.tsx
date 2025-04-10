import { Eye, Edit, Trash, Archive, Check } from "lucide-react";
import { Link } from "react-router";
import type { IProduct } from "../../../../types/Types";
import { useState } from "react";
import WarningModal from "../../../WarningModal";
import serverAPI from "../../../../helper/axios";
import toast from "react-hot-toast";

const ProductActionButtons = ({
  product,
  onDelete,
  onArchive,
  onRecover,
}: {
  product: IProduct;
  onDelete: (productId: string) => void;
  onArchive: (productId: string) => void;
  onRecover: (productId: string) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    header: "",
    text: "",
    confirmText: "",
    onConfirm: async () => {},
  });
  const openModal = (
    header: string,
    text: string,
    confirmText: string,
    onConfirm: () => Promise<void>
  ) => {
    setModalConfig({ header, text, confirmText, onConfirm });
    setIsModalOpen(true);
  };
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

  const handleArchive = async () => {
    try {
      await serverAPI.patch(
        `/product/${product._id}/soft-delete`,
        {},
        {
          withCredentials: true,
        }
      );
      onArchive(product._id);
      setIsModalOpen(false);
      toast.success("Product archived successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to archive product:");
      toast.error(
        error.response.data?.error ||
          "Error archiving product. Please try again."
      );
    }
  };

  const handleRecover = async () => {
    try {
      await serverAPI.patch(
        `/product/${product._id}/recover`,
        {},
        {
          withCredentials: true,
        }
      );
      onRecover(product._id);
      setIsModalOpen(false);
      toast.success("Product recovered successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to recover product:");
      toast.error(
        error.response.data?.error ||
          "Error recovering product. Please try again."
      );
    }
  };
  return (
    <div className="flex gap-2 justify-center">
      <Link to={`/admin/product/${product._id}`}>
        <button
          data-testid="view-button"
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700"
        >
          <Eye size={16} />
        </button>
      </Link>
      <Link to={`/admin/product/edit/${product._id}`}>
        <button
          data-testid="edit-button"
          className="p-2 bg-amber-500 text-white rounded-full hover:bg-amber-700"
        >
          <Edit size={16} />
        </button>
      </Link>
      {!product.isArchived ? (
        <button
          data-testid="archive-button"
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700"
          onClick={() =>
            openModal(
              "Confirm Archiving",
              `Are you sure you want to archive "${product.name}"?`,
              "Archive",
              handleArchive
            )
          }
        >
          <Archive size={16} />
        </button>
      ) : (
        <>
          <button
            data-testid="recover-button"
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-700"
            onClick={() =>
              openModal(
                "Confirm Recovery",
                `Are you sure you want to recover "${product.name}"?`,
                "Recover",
                handleRecover
              )
            }
          >
            <Check size={16} />
          </button>
          <button
            data-testid="delete-button"
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700"
            onClick={() =>
              openModal(
                "Confirm Deletion",
                `Are you sure you want to Permanently Delete "${product.name}"?`,
                "Delete",
                handleDelete
              )
            }
          >
            <Trash size={16} />
          </button>
        </>
      )}

      <WarningModal
        header={modalConfig.header}
        text={modalConfig.text}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        confirmText={modalConfig.confirmText}
        onConfirm={modalConfig.onConfirm}
      />
    </div>
  );
};

export default ProductActionButtons;
