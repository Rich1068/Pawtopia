import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getFullImageUrl } from "../../../../helper/imageHelper";
import { IAddProduct } from "../../../../types/Types";

const ProductImageUpload = ({
  setImages,
  existingImages = [],
  previews,
  setPreviews,
  setProduct,
}: {
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  existingImages?: string[];
  previews: string[];
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
  setProduct: React.Dispatch<React.SetStateAction<IAddProduct>>;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (existingImages.length > 0) {
      setPreviews(existingImages);
    }
  }, [existingImages]);

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);

    if (fileArray.length > 0) {
      setImages((prev) => [...prev, ...fileArray]);
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
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
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
        {previews.map((src, index) => (
          <div
            key={index}
            className="relative p-2 flex items-center justify-center"
          >
            <div className="relative">
              <img
                src={src.startsWith("blob:") ? src : getFullImageUrl(src)}
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
