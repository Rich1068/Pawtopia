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
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-6 justify-center">
          {products.map((prod) => {
            const price = prod.price
              ? parseFloat(prod.price).toFixed(2)
              : "0.00";

            return (
              <div className="mx-auto" key={prod._id}>
                <div className="group relative mt-11 w-70 h-90 transform overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-102 hover:shadow-xl border border-gray-200 font-primary">
                  {/* Image Wrapper with Dark Overlay on Hover */}
                  <div className="relative">
                    <Link to={`/shop/product/${prod._id}`}>
                      <CardImages
                        item={prod}
                        getImageUrls={(prod) =>
                          prod.images.map((pic) => getFullImageUrl(pic)) || []
                        }
                        style="!h-70 !object-contain"
                      />
                    </Link>

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <Link
                        to={`/shop/product/${prod._id}`}
                        className="bg-orange-600 text-white text-center py-2 px-4 rounded-md font-semibold hover:bg-orange-700 transition duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  <div className="pt-3 p-2 flex flex-col ">
                    <h2 className="text-lg lg:text-xl font-medium font-primary text-orange-600 text-center truncate">
                      {prod.name}
                    </h2>

                    {/* Price Section */}
                    <div className="text-md font-semibold font-secondary text-gray-700 text-center">
                      ${price}
                    </div>
                  </div>
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
