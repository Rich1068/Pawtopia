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
        <h2 className="text-2xl font-semibold text-orange-500 mb-4 font-primary">
          {request.petName} Adoption Request
        </h2>

        {/* Adoption Details */}
        <div className="space-y-3 text-gray-700 font-secondary">
          <div className="flex justify-between font-bold">
            <span>Status:</span>
            <span
              className={`font-normal px-2 py-1 rounded-md text-white ${
                request.status === "pending"
                  ? "bg-yellow-400"
                  : request.status === "approved"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {request.status}
            </span>
          </div>

          <hr className="border-gray-300" />

          <div className="flex justify-between">
            <span className="font-bold">Adopter:</span>
            <span className="font-normal">{request.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold">Email:</span>
            <span className="font-normal">{request.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold">Phone Number:</span>
            <span className="font-normal">{request.phone}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold">Address:</span>
            <span className="font-normal">{request.address}</span>
          </div>

          <hr className="border-gray-300" />

          <div className="flex justify-between">
            <span className="font-bold">Mode of Communication:</span>
            <span className="font-normal">{request.mode}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold">Living Situation:</span>
            <span className="font-normal">{request.livingSituation}</span>
          </div>

          <hr className="border-gray-300" />

          <div>
            <span className="font-bold">Reason for Adoption:</span>
            <p className="font-normal mt-1 text-gray-600">{request.reason}</p>
          </div>
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
