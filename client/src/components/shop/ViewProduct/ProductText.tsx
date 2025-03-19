import { FC, Link } from "react";
import type { IProduct } from "../../../types/Types";

const ProductText: FC<{ productData: IProduct }> = ({ productData }) => {
  const { name, description, category, price } = productData;
  return (
    <div
      className="p-4 bg-white rounded-lg shadow-md min-w-full min-h-full relative inline-block font-secondary"
      data-testid="pet-page"
    >
      <h2
        className="text-3xl font-bold mb-2 text-orange-600"
        data-testid="pet-name"
      >
        {name}
      </h2>
      <p className="text-gray-800 font-semibold" data-testid="pet-breed">
        <strong>Category: </strong> {category.map((cat) => cat)}
      </p>
      <p className="text-gray-800 font-semibold" data-testid="pet-breed">
        <strong>Price: </strong> {price}
      </p>
      <p className="text-gray-800 font-semibold" data-testid="pet-breed">
        <strong>Description: </strong> {description}
      </p>
    </div>
  );
};
export default ProductText;
