import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getFullImageUrl } from "../../../../helper/imageHelper";
import { IProductImage } from "../../../../types/Types";
const ProductImageUpload = ({
  productImages,
  setProductImages,
}: {
  productImages: IProductImage[];
  setProductImages: React.Dispatch<React.SetStateAction<IProductImage[]>>;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    const existingCount = productImages.length;
    const maxAllowed = 5;

    const validFiles = fileArray.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} must be a JPG or PNG.`);
        return false;
      }

      if (file.size > maxSize) {
        alert(`File ${file.name} is larger than 2MB.`);
        return false;
      }

      return true;
    });

    const remainingSlots = maxAllowed - existingCount;
    if (validFiles.length > remainingSlots) {
      alert(`You can only add ${remainingSlots} more image(s).`);
    }

    const filesToAdd = validFiles.slice(0, remainingSlots);

    const newImageObjects = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));

    setProductImages((prev) => [...prev, ...newImageObjects]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="w-full">
      {/* Dropzone Area */}
      <div
        className={`border-2 ${
          isDragging ? "border-orange-500" : "border-gray-300"
        } border-dashed p-6 mb-4 rounded-lg my-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-gray-500 font-primary">
          {isDragging
            ? "Drop your images here..."
            : "Drag & drop images here or click to upload"}
        </p>
      </div>

      {/* Image Previews */}
      <div className="max-w-4xl grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4">
        {productImages.map((img, index) => (
          <div
            key={index}
            className="relative p-2 flex items-center justify-center"
          >
            <div className="relative">
              <img
                src={
                  img.preview.startsWith("blob:")
                    ? img.preview
                    : getFullImageUrl(img.preview)
                }
                alt="Preview"
                className="w-full h-auto max-w-50 max-h-50 lg:max-w-75 lg:max-h-75 object-contain rounded border-gray-200 border"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 p-1 text-xs bg-red-500 rounded-full shadow-md"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="text-white w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageUpload;
