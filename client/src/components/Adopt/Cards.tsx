import './cards.css';
import { FC } from 'react';
import { Pets } from '../../types/Types';
import {faPaw} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface CardsProps {
  pets: Pets; // Accepts an array of pets
}

const Cards: FC<CardsProps> = ({ pets }) => {
  return (
    <div className="rounded-xl bg-white p-4 h-full w-full flex-grow bottom-0">
      {pets.length > 0 ? (
        <div className="grid grid-cols-5 content-center w-full max-sm:grid-cols-1 sm:max-md:grid-cols-2 md:max-lg:grid-cols-3 lg:max-xl:grid-cols-4 gap-4">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="inline-grid m-auto mt-11 w-60 transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img
                className="h-48 w-full object-cover object-center"
                src={pet.photoUrls[0] || "assets/img/Logo1.png"}
              />
              <div className="p-4">
                <h2 className="mb-2 text-lg font-medium text-center dark:text-white text-gray-900">
                  {pet.name} {/* ✅ Display pet name */}
                </h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
      <div className="flex justify-center items-center py-10">
        <div className="w-96 p-6 bg-white dark:bg-slate-800 text-orange-600 shadow-md rounded-lg flex flex-col items-center text-center">
          <FontAwesomeIcon icon={faPaw} size='3x'/>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
            No Pets Available
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Check back later or try selecting different filters.
          </p>
        </div>
      </div>
      )}
    </div>
  );
};

export default Cards;
