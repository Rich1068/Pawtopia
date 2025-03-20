import { useState, FC } from "react";
import { petType } from "../../types/pet";
import FavoriteButton from "./FavoriteButton";
import { cleanImageUrl } from "../../helper/imageHelper";

interface ICardImages {
  pet: petType;
}

const CardImages: FC<ICardImages> = ({ pet }) => {
  const pictures = pet.relationships?.pictures?.data || [];
  const [imgIndex, setImgIndex] = useState(0);
  const getImageUrl = (index: number) =>
    pictures[index]
      ? `${cleanImageUrl(pet.attributes.pictureThumbnailUrl)}/${
          pictures[index].id
        }.jpg`
      : "assets/img/Logo1.png";

  return (
    <>
      <img
        className="h-48 w-full object-cover object-center"
        src={getImageUrl(imgIndex)}
        onError={() => {
          if (imgIndex < pictures.length - 1) {
            setImgIndex((prevIndex) => prevIndex + 1);
          } else {
            setImgIndex(-1);
          }
        }}
        alt="Pet"
      />
      <FavoriteButton pet={pet} />
    </>
  );
};
export default CardImages;
