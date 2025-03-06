/* eslint-disable @typescript-eslint/no-explicit-any */
import "./cards.css";
import { FC } from "react";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import { petType } from "../../types/pet";
import CardImages from "./CardImages";
import AdoptFilter from "./AdoptFilter";
import { PetCounts, PetFilter } from "../../types/Types";

interface ICards {
  pets: petType[];
  selected: PetFilter;
  setSelected: React.Dispatch<React.SetStateAction<PetFilter>>;
  petCounts: PetCounts;
}

const Cards: FC<ICards> = ({ pets, selected, setSelected, petCounts }) => {
  const cleanImageUrl = (url: string | undefined): string | undefined => {
    let cleanedUrl = url?.split("?")[0];
    cleanedUrl = cleanedUrl?.replace(/\/\d+(?=\.\w+$)/, "");
    cleanedUrl = cleanedUrl?.replace(/\.\w+$/, "");
    return cleanedUrl;
  };

  return (
    <div className="rounded-t-xl bg-white p-4 h-full w-full flex-grow bottom-0 min-h-svh">
      <div className="flex flex-row min-h-svh">
        <AdoptFilter
          selected={selected}
          setSelected={setSelected}
          petCounts={petCounts}
        />
        {pets.length > 0 ? (
          <div className="grid grid-cols-5 content-start w-full max-sm:grid-cols-2 sm:max-md:grid-cols-2 md:max-lg:grid-cols-3 lg:max-xl:grid-cols-4 max-xl:pl-0 max-xl:pr-0 max-[1600px]:pl-5 max-[1600px]:pr-5 max-[1700px]:pl-10 max-[1700px]:pr-10 pl-10 pr-10">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="inline-grid m-auto mt-11 w-60 max-sm:w-50 transform overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Link
                  to={`/adopt/pets/${pet.id}`}
                  key={pet.id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CardImages pet={pet} cleanImageUrl={cleanImageUrl} />

                  <div className="p-4">
                    <h2 className="mb-2 text-lg font-bold font-secondary text-center text-orange-600">
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
    </div>
  );
};

export default Cards;
