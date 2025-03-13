import { FC } from "react";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import { petType } from "../../types/pet";
import CardImages from "./CardImages";

interface ICards {
  pets: petType[];
  cleanImageUrl: (url: string | undefined) => string | undefined;
  header: string;
  text: string;
}

const Cards: FC<ICards> = ({ pets, cleanImageUrl, header, text }) => {
  return (
    <>
      {pets.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] m-auto">
          {pets.map((pet) => (
            <div className="mx-auto" key={pet.id}>
              <div className=" mt-11 w-60 max-sm:w-50 transform overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-lg">
                <Link
                  to={`/adopt/pets/${pet.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CardImages pet={pet} cleanImageUrl={cleanImageUrl} />

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
        <div className="absolute left-0 right-0 flex py-10 pointer-events-none">
          <div className="w-96 p-6 bg-white text-orange-600 shadow-md rounded-lg flex flex-col items-center text-center left-0 right-0 mx-auto">
            <FontAwesomeIcon icon={faPaw} size="3x" />
            <h2 className="text-lg font-semibold text-gray-700">{header}</h2>
            <p className="text-gray-500">{text}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Cards;
