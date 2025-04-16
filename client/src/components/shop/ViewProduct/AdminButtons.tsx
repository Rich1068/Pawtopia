import { Trash, Archive, Check } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { FC, useState } from "react";
import WarningModal from "../../WarningModal";
import { useProduct, useProductMutations } from "../../../hooks/useProducts";

interface IAdminButtons {
  productId: string;
  isArchived: boolean;
  productName: string;
}

const AdminButtons: FC<IAdminButtons> = ({
  productId,
  isArchived,
  productName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    header: "",
    text: "",
    confirmText: "",
    onConfirm: async () => {},
  });
  const navigate = useNavigate();
  const { archiveProduct, recoverProduct, deleteProduct } =
    useProductMutations();

  const { refetch } = useProduct();

  const openModal = (
    header: string,
    text: string,
    confirmText: string,
    onConfirm: () => Promise<void>
  ) => {
    setModalConfig({ header, text, confirmText, onConfirm });
    setIsModalOpen(true);
  };

  const handleArchive = async () => {
    try {
      await archiveProduct.mutateAsync(productId);
      setIsModalOpen(false);
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleRecover = async () => {
    try {
      await recoverProduct.mutateAsync(productId);
      setIsModalOpen(false);
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(productId);
      setIsModalOpen(false);
      refetch();
      navigate("/admin/product-list");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <Link to={`/admin/product/edit/${productId}`}>
        <button className="px-2 h-10 text-lg cursor-pointer hover:bg-orange-400 font-primary font-base border rounded-lg bg-orange-500 text-white">
          Edit Product
        </button>
      </Link>

      {!isArchived ? (
        <button
          className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-md hover:bg-red-700 cursor-pointer"
          onClick={() =>
            openModal(
              "Confirm Archiving",
              `Are you sure you want to archive "${productName}"?`,
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
            className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-md hover:bg-green-700 cursor-pointer"
            onClick={() =>
              openModal(
                "Confirm Recovery",
                `Are you sure you want to recover "${productName}"?`,
                "Recover",
                handleRecover
              )
            }
          >
            <Check size={16} />
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-md hover:bg-red-700 cursor-pointer"
            onClick={() =>
              openModal(
                "Confirm Deletion",
                `Are you sure you want to permanently delete "${productName}"?`,
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
    </>
  );
};

export default AdminButtons;
