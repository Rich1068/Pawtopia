/* eslint-disable @typescript-eslint/no-explicit-any */
import "./cards.css";
import { FC } from "react";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import { petType } from "../../types/pet";
const Cards: FC<{ pets: petType[] }> = ({ pets }) => {
  const cleanImageUrl = (url: string | undefined): string | undefined => {
    let cleanedUrl = url?.split("?")[0];
    cleanedUrl = cleanedUrl?.replace(/\/\d+(?=\.\w+$)/, "");
    cleanedUrl = cleanedUrl?.replace(/\.\w+$/, "");
    return cleanedUrl;
  };

  return (
    <div className="rounded-t-xl bg-white p-4 h-full w-full flex-grow bottom-0">
      {pets.length > 0 ? (
        <div className="grid grid-cols-5 content-center w-full max-sm:grid-cols-2 sm:max-md:grid-cols-2 md:max-lg:grid-cols-3 lg:max-xl:grid-cols-4 max-xl:pl-0 max-xl:pr-0 max-[1600px]:pl-5 max-[1600px]:pr-5 max-[1700px]:pl-10 max-[1700px]:pr-10 pl-40 pr-40">
          {pets.map((pet) => (
            <div className="inline-grid m-auto mt-11 w-60 max-sm:w-50 transform overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-lg">
              <Link
                to={`/adopt/pets/${pet.id}`}
                key={pet.id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="h-48 w-full object-cover object-center"
                  src={
                    pet.attributes.pictureThumbnailUrl
                      ? cleanImageUrl(pet.attributes.pictureThumbnailUrl) +
                        (pet.relationships?.pictures?.data?.[0]?.id
                          ? `/${pet.relationships.pictures.data[0].id}.jpg`
                          : "") // Only add if ID exists
                      : "assets/img/Logo1.png"
                  }
                />
                <div className="p-4">
                  <h2 className="mb-2 text-lg font-medium text-center text-gray-900">
                    {pet.attributes.name} {/* ✅ Display pet name */}
                  </h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-10">
          <div className="w-96 p-6 bg-white text-orange-600 shadow-md rounded-lg flex flex-col items-center text-center">
            <FontAwesomeIcon icon={faPaw} size="3x" />
            <h2 className="text-lg font-semibold text-gray-700">
              No Pets Available
            </h2>
            <p className="text-gray-500">
              Check back later or try selecting different filters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
