import { useState, FC } from "react";
import ReactModal from "react-modal";
interface ImageUploadPropTypes {
  isOpen: boolean;
  onClose: () => void;
  onImageSave: (image: File | null) => void | Promise<void>;
}

const ProfileImageUpload: FC<ImageUploadPropTypes> = ({
  isOpen,
  onClose,
  onImageSave,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [transferImage, setTransferImage] = useState<File | null>(null);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      console.log(file);
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      setTransferImage(file);
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md mx-auto"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    >
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
        Upload Profile Picture
      </h2>

      {/* Image Preview with Circular Outline */}
      <div className="flex justify-center">
        <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-500">No Image</span>
          )}
        </div>
      </div>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        className="mt-4 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        onChange={handleImageUpload}
        data-testid="file-input"
      />

      {/* Modal Actions */}
      <div className="flex justify-end mt-5">
        <button
          className="px-4 py-2 bg-gray-300 rounded-lg mr-2 hover:bg-gray-400"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-white ${
            selectedImage
              ? "bg-orange-600 hover:bg-orange-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() => onImageSave(transferImage || null)}
          disabled={!selectedImage}
        >
          Save
        </button>
      </div>
    </ReactModal>
  );
};

export default ProfileImageUpload;
