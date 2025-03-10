import { FC } from "react";
import type { petType } from "../../types/pet";

interface IPetPageText {
  id: string | undefined;
  petData: petType | null;
}

export const PetPageText: FC<IPetPageText> = ({ petData }) => {
  console.log("this is from pagetext", petData);
  return (
    <div className="p-4 bg-white rounded-lg shadow-md min-w-full min-h-full inline-block font-secondary">
      {petData && (
        <>
          {/* Pet Name */}
          <h2 className="text-3xl font-bold mb-2 text-orange-600">
            {petData.attributes?.name}
          </h2>

          {/* Pet Details */}
          <p className="text-gray-800 font-semibold">
            <strong>Breed:</strong> {petData.attributes?.breedString}
          </p>
          <p className="text-gray-600">
            <strong>Age Group:</strong> {petData.attributes?.ageGroup ?? "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Sex:</strong> {petData.attributes?.sex}
          </p>
          <p className="text-gray-600">
            <strong>Size:</strong> {petData.attributes?.sizeGroup ?? "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Coat Length:</strong>{" "}
            {petData.attributes?.coatLength ?? "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Vaccinated:</strong>{" "}
            {petData.attributes?.isCurrentVaccinations ? "Yes" : "No"}
          </p>

          {/* Adoption Status */}
          <p className="text-gray-600">
            <strong>Status:</strong>{" "}
            {petData.attributes?.isAdoptionPending ? "Pending" : "Available"}
          </p>

          {/* Description */}
          {petData.attributes?.descriptionHtml && (
            <div className="mt-4">
              <strong className="text-gray-800">About:</strong>
              <p
                className="text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: petData.attributes.descriptionHtml,
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PetPageText;
