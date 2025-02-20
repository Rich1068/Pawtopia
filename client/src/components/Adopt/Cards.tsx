import './cards.css';
import { FC } from 'react';
import { Pets } from '../../types/petType';

interface CardsProps {
  pets: Pets; // Accepts an array of pets
}

const Cards: FC<CardsProps> = ({ pets }) => {
  return (
    <div className='rounded-xl bg-white'>
    <div className="grid grid-cols-5 content-center w-full max-sm:grid-cols-1 sm:max-md:grid-cols-2 md:max-lg:grid-cols-3 lg:max-xl:grid-cols-4 gap-4">
      {pets.length > 0 ? (
        pets.map((pet, i) => (
          <div
            key={pet.id}
            className="inline-grid m-auto mt-11 w-60 transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300 hover:scale-105 hover:shadow-lg"
          >
            <img
              className="h-48 w-full object-cover object-center"
              src={pet.photoUrls[i] || "assets/img/Logo1.png"}
            />
            <div className="p-4">
              <h2 className="mb-2 text-lg font-medium text-center dark:text-white text-gray-900">
                {pet.name} {/* ✅ Display pet name */}
              </h2>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No pets available.</p> // ✅ Fallback if no pets exist
      )}
      </div>
      </div>
  );
};

export default Cards;
