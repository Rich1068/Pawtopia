import { IAdoptRequest } from "../../types/Types";
import { FC } from "react";

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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-555">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold">
          {request.petName} Adoption Request
        </h2>
        <p className="font-semibold">
          Adopter: <span className="font-normal">{request.name}</span>
        </p>
        <p className="font-semibold">
          Status: <span className="font-normal">{request.status}</span>
        </p>
        <p className="font-semibold">
          Living Situation:{" "}
          <span className="font-normal">{request.livingSituation}</span>
        </p>
        <p className="font-semibold">
          Reason for Adoption:{" "}
          <span className="font-normal">{request.reason}</span>
        </p>

        <button
          className="text-blue-500 hover:underline mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AdoptRequestModal;
