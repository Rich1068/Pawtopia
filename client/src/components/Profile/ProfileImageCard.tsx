import { UserRound, Pencil } from "lucide-react";
import { FC, useState } from "react";
import { User } from "../../types/Types";
import ProfileImageUpload from "./ProfileImageUpload";
import { useUploadProfileImage } from "../../hooks/useProfile";

const ProfileImageCard: FC<{ user: User }> = ({ user }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const uploadMutation = useUploadProfileImage();

  const handleImageSave = (image: File | null) => {
    if (image) {
      uploadMutation.mutate({ userId: user._id, image });
    }
    setModalIsOpen(false);
  };

  return (
    <>
      <ProfileImageUpload
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onImageSave={handleImageSave}
      />
      <div className="flex flex-col justify-center relative w-full min-h-60 max-w-80 lg:ml-auto mx-auto lg:mr-10 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="inline-block">
          <div className="relative group w-30 h-30 mx-auto">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-30 h-30 rounded-full object-cover"
              />
            ) : (
              <UserRound
                data-testid="lucide-user-round"
                className="text-orange-600 border rounded-full w-30 h-30"
              />
            )}
            <div
              data-testid="edit-profileImage-button"
              className="absolute inset-0 bg-orange-500 bg-opacity-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={() => {
                setModalIsOpen(true);
              }}
            >
              <Pencil className="text-white w-6 h-6" />
            </div>
          </div>
          <div className="break-words mx-5">
            <h5 className="mb-1 text-2xl font-medium text-gray-900">
              {user.name}
            </h5>
            <span className="text-sm text-gray-500">{user.role}</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfileImageCard;
