import { UserRound, Pencil } from "lucide-react";
import { FC, useContext, useState } from "react";
import { User } from "../../types/Types";
import ProfileImageUpload from "./ProfileImageUpload";
import { AuthContext } from "../../context/AuthContext";
import serverAPI from "../../helper/axios";

const ProfileImageCard: FC<{ user: User }> = ({ user }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { verifyToken } = useContext(AuthContext)!;
  const handleImageSave = async (image: File | null) => {
    //console.log(profileImage)
    const formData = new FormData();
    if (image) {
      formData.append("image", image);
      formData.append("userId", user!._id); // Send userId
      try {
        const { data } = await serverAPI.post("/user/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        console.log(data);
        verifyToken();
      } catch (error) {
        console.log("Error here ", error);
      }
    }

    setModalIsOpen(false); // Close modal
  };
  return (
    <>
      <ProfileImageUpload
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onImageSave={handleImageSave}
      />
      <div className="flex flex-col  justify-center relative w-full min-h-60 max-w-80 ml-auto mr-10 text-center bg-white border border-gray-200 rounded-lg shadow-sm mt-30 max-[935px]:mr-auto max-[896px]:mt-15">
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
