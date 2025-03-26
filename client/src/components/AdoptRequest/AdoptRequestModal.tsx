import { IAdoptRequest } from "../../types/Types";
import { FC } from "react";
import { X } from "lucide-react"; // Importing Lucide icon for close button

interface IAdoptRequestModal {
  isOpen: boolean;
  onClose: () => void;
  request: IAdoptRequest | null;
}

const AdoptRequestModal: FC<IAdoptRequestModal> = ({
  isOpen,
  onClose,
  request,
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-[90%] max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-orange-500 mb-4">
          {request.petName} Adoption Request
        </h2>

        {/* Adoption Details */}
        <div className="space-y-3 text-gray-700">
          <p className="font-semibold">
            Adopter: <span className="font-normal">{request.name}</span>
          </p>
          <p className="font-semibold">
            Status:{" "}
            <span className="font-normal capitalize">{request.status}</span>
          </p>
          <p className="font-semibold">
            Living Situation:{" "}
            <span className="font-normal">{request.livingSituation}</span>
          </p>
          <p className="font-semibold">
            Reason for Adoption:
            <span className="block font-normal mt-1 text-gray-600">
              {request.reason}
            </span>
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdoptRequestModal;
