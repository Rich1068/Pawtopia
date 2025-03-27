import { Eye, Edit, Trash } from "lucide-react";
import type { IProduct } from "../../../../types/Types";

const ProductActionButtons = ({ product }: { product: IProduct }) => {
  return (
    <div className="flex gap-2 justify-center">
      <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700">
        <Eye size={16} />
      </button>
      <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-700">
        <Edit size={16} />
      </button>
      <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700">
        <Trash size={16} />
      </button>
    </div>
  );
};

export default ProductActionButtons;
