import { FC } from "react";
import type { petType } from "../../types/pet";

interface IPetPageText {
  petData: petType | null;
}

export const PetPageText: FC<IPetPageText> = ({ petData }) => {
  if (!petData) return null;

  const {
    name,
    breedString,
    ageGroup,
    sex,
    sizeGroup,
    coatLength,
    isCurrentVaccinations,
    isAdoptionPending,
    descriptionHtml,
  } = petData.attributes || {};

  const petAttributes = [
    {
      label: "Age Group",
      value: ageGroup ?? "N/A",
      testId: "pet-age-group",
    },
    { label: "Sex", value: sex, testId: "pet-sex" },
    { label: "Size", value: sizeGroup ?? "N/A", testId: "pet-size" },
    {
      label: "Coat Length",
      value: coatLength ?? "N/A",
      testId: "pet-coat-length",
    },
    {
      label: "Vaccinated",
      value: isCurrentVaccinations ? "Yes" : "No",
      testId: "pet-vaccinated",
    },
    {
      label: "Status",
      value: isAdoptionPending ? "Pending" : "Available",
      testId: "pet-status",
    },
  ];
  return (
    <div
      className="p-4 bg-white rounded-lg shadow-md min-w-full min-h-full inline-block font-secondary"
      data-testid="pet-page"
    >
      <h2
        className="text-3xl font-bold mb-2 text-orange-600"
        data-testid="pet-name"
      >
        {name}
      </h2>

      <p className="text-gray-800 font-semibold" data-testid="pet-breed">
        <strong>Breed:</strong> {breedString}
      </p>

      {petAttributes.map(({ label, value, testId }) => (
        <p key={testId} className="text-gray-600" data-testid={testId}>
          <strong>{label}:</strong> {value}
        </p>
      ))}

      {descriptionHtml && (
        <div className="mt-4" data-testid="pet-description">
          <strong className="text-gray-800">About:</strong>
          <p
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        </div>
      )}
    </div>
  );
};

export default PetPageText;
