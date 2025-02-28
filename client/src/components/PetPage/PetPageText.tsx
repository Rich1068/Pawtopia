import { FC } from "react";
import { Pet } from "../../types/Types";
interface IPetPageText {
  id: string | undefined;
  petData: Pet | null;
}
export const PetPageText: FC<IPetPageText> = ({ petData }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md min-w-full min-h-full inline-block font-secondary">
      {petData && (
        <>
          <h2 className="text-3xl font-bold mb-2">{petData.name}</h2>
          <p className="text-gray-800 font-semibold">Name: {petData.name}</p>
          <p className="text-gray-600">Status: {petData.status}</p>
          {petData.category && (
            <p className="text-gray-600">Category: {petData.category.name}</p>
          )}
          {petData.tags && petData.tags.length > 0 && (
            <p className="text-gray-600">
              Tags: {petData.tags.map((tag) => tag.name).join(", ")}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default PetPageText;
