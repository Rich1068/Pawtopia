import { FC } from "react";
import type { IProduct } from "../../../types/Types";
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
              isArchived={productData.isArchived!}
              productName={productData.name}
            />
          </div>
        ) : (
          <div className="absolute bottom-5">
            <UserButtons product={productData} />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductText;
