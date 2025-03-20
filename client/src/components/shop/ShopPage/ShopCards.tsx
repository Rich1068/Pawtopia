import { FC } from "react";
import { Link } from "react-router";
import { IProduct } from "../../../types/Types";
import CardImages from "../../CardImages";
import WarningContainer from "../../WarningContainer";
import { getFullImageUrl } from "../../../helper/imageHelper";

interface ICards {
  products: IProduct[];
  header: string;
  text: string;
}

const ShopCards: FC<ICards> = ({ products, header, text }) => {
  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-6 justify-center">
          {products.map((prod) => {
            const price = prod.price
              ? parseFloat(prod.price).toFixed(2)
              : "0.00";

            return (
              <div className="mx-auto" key={prod._id}>
                <div className="mt-11 w-64 transform overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-xl border border-gray-200">
                  <Link
                    to={`/shop/product/${prod._id}`}
                    rel="noopener noreferrer"
                  >
                    <CardImages
                      item={prod}
                      getImageUrls={(prod) =>
                        prod.images.map((pic) => getFullImageUrl(pic)) || []
                      }
                    />

                    <div className="p-4 flex flex-col space-y-2">
                      <h2 className="text-lg font-bold font-secondary text-orange-600 text-center truncate">
                        {prod.name}
                      </h2>

                      {/* Price Section */}
                      <div className="text-md font-bold text-gray-700 text-center">
                        ${price}
                      </div>

                      {/* View Details Button */}
                      <Link
                        to={`/shop/product/${prod._id}`}
                        className="mt-2 block bg-orange-600 text-white text-center py-2 rounded-md font-semibold hover:bg-orange-700 transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <WarningContainer header={header} text={text} />
      )}
    </>
  );
};

export default ShopCards;
