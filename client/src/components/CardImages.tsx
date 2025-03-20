import { useState } from "react";
import FavoriteButton from "./Adopt/FavoriteButton";
import { petType } from "../types/pet";

interface ICardImages<T> {
  item: T;
  getImageUrls: (item: T) => string[]; // Function to extract image URLs
}

const CardImages = <T extends object>({
  item,
  getImageUrls,
}: ICardImages<T>) => {
  const images = getImageUrls(item);
  const [imgIndex, setImgIndex] = useState(0);
  console.log(images);
  return (
    <>
      <img
        className="h-48 w-full object-cover object-center"
        src={images[imgIndex] || "assets/img/Logo1.png"}
        onError={() => {
          if (imgIndex < images.length - 1) {
            setImgIndex((prev) => prev + 1);
          } else {
            setImgIndex(-1);
          }
        }}
        alt="Item"
      />
      {"relationships" in item && "attributes" in item && (
        <FavoriteButton pet={item as unknown as petType} />
      )}
    </>
  );
};

export default CardImages;
