import { Trash } from "lucide-react";
import { Link } from "react-router";
import { FC } from "react";

interface IAdminButtons {
  productId: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminButtons: FC<IAdminButtons> = ({ productId, setIsModalOpen }) => {
  return (
    <>
      <Link to={`/admin/product/edit/${productId}`}>
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
    </>
  );
};

export default AdminButtons;
