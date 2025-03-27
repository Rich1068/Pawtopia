import React from "react";
import ReactModal from "react-modal";
import { X } from "lucide-react";

interface ImageModalProps {
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  isOpen,
  onClose,
}) => {
  if (!imageUrl) return null;

  return (
    <ReactModal
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={onClose}
      className="p-6 focus:outline-none rounded-lg w-[100%] max-w-2xl mx-auto z-999"
      overlayClassName="fixed inset-0 bg-black/75 flex justify-center items-center z-999"
    >
      <div className="relative flex justify-center items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl"
          data-testid="close-modal-button"
        >
          <X size={30} />
        </button>

        {/* Centered Image */}
        <img
          src={imageUrl}
          alt="Large preview"
          className="max-w-full min-w-full max-h-[90vh] rounded-lg object-contain"
        />
      </div>
    </ReactModal>
  );
};

export default ImageModal;
