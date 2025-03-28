import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import { FC } from "react";

interface IWarningModal {
  header?: string;
  text?: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmText?: string;
  onConfirm?: () => void;
}
export const WarningModal: FC<IWarningModal> = ({
  header,
  text,
  isModalOpen,
  setIsModalOpen,
  confirmText = "Confirm",
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      className="bg-white w-96 flex flex-col p-6 rounded-lg shadow-lg max-w-sm mx-auto font-primary z-555"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-center z-555 pointer-events-auto"
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
    >
      <div
        className="fixed inset-0 flex justify-center items-center pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(false);
        }}
      >
        <div
          className="bg-white w-96 flex flex-col p-6 rounded-lg shadow-lg max-w-sm mx-auto font-primary"
          onClick={(e) => e.stopPropagation()} // Stops event bubbling
        >
          <div
            className="text-orange-600 rounded-lg flex flex-col items-center text-center mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <FontAwesomeIcon icon={faPaw} size="3x" />
            <h2 className="text-2xl font-semibold text-gray-700">{header}</h2>
            <p className="text-gray-500">{text}</p>
            <div className="flex gap-x-5 m-2">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-pointer ring-orange-500 
          hover:bg-gray-500 transition duration-300"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>

              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer 
          hover:bg-orange-600 transition duration-300"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default WarningModal;
