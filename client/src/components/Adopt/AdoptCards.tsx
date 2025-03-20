import { FC } from "react";
import { Link } from "react-router";
import { petType } from "../../types/pet";
import CardImages from "../CardImages";
import WarningContainer from "../WarningContainer";
import { cleanImageUrl } from "../../helper/imageHelper";

interface ICards {
  pets: petType[];
  header: string;
  text: string;
}

const AdoptCards: FC<ICards> = ({ pets, header, text }) => {
  return (
    <>
      {pets.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] m-auto">
          {pets.map((pet) => (
            <div className="mx-auto" key={pet.id}>
              <div className=" mt-11 w-60 max-[415px]:w-70 transform overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-lg">
                <Link to={`/adopt/pets/${pet.id}`} rel="noopener noreferrer">
                  <CardImages
                    item={pet}
                    getImageUrls={(pet) =>
                      pet.relationships?.pictures?.data.map(
                        (pic) =>
                          `${cleanImageUrl(
                            pet.attributes.pictureThumbnailUrl
                          )}/${pic.id}.jpg`
                      ) || []
                    }
                  />

                  <div className="p-4">
                    <h2 className="mb-2 text-lg font-bold font-secondary text-center text-orange-600">
                      {pet.attributes.name}
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

export default AdoptCards;
