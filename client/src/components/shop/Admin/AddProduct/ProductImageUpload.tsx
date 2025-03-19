import { useState } from "react";
import { X } from "lucide-react";

const ProductImageUpload = ({
  onImagesSelect,
}: {
  onImagesSelect: React.Dispatch<React.SetStateAction<File[]>>;
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);

    if (fileArray.length > 0) {
      // Update parent component
      onImagesSelect([...selectedFiles, ...fileArray]);

      // Generate previews
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
      setSelectedFiles((prev) => [...prev, ...fileArray]);
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
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    onImagesSelect((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {/* Dropzone Area */}
      <div
        className={`border-2 ${
          isDragging ? "border-blue-500" : "border-gray-300"
        } border-dashed p-6 mb-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200`}
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
          data-testid="image-upload"
        />
        <p className="text-gray-500">
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
                src={src}
                alt="Preview"
                className="w-full h-auto max-w-50 max-h-50 lg:max-w-75 lg:max-h-75 object-contain rounded border-gray-200 border"
              />
              {/* Close button positioned relative to the img */}
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
