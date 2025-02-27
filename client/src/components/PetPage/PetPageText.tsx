import { FC } from "react";
import { Pet } from "../../types/Types";
interface IPetPageText {
  id: string | undefined;
  petData: Pet | null;
}
export const PetPageText: FC<IPetPageText> = ({ id, petData }) => {
  return (
    <div className="w-1/3 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Pet Details</h2>
      <p className="text-gray-600">Pet ID: {id}</p>
      {petData && (
        <>
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
