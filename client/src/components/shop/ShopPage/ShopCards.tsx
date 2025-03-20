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
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] m-auto">
          {products.map((prod) => (
            <div className="mx-auto" key={prod._id}>
              <div className=" mt-11 w-60 max-[415px]:w-70 transform overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-lg">
                <Link
                  to={`/product/${prod._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CardImages
                    item={prod}
                    getImageUrls={(prod) =>
                      prod.images.map((pic) => getFullImageUrl(pic)) || []
                    }
                  />

                  <div className="p-4">
                    <h2 className="mb-2 text-lg font-bold font-secondary text-center text-orange-600">
                      {prod.name}
                    </h2>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <WarningContainer header={header} text={text} />
      )}
    </>
  );
};

export default ShopCards;
