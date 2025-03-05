import { useContext, useState } from "react";
import ProfileField from "./ProfileField";
import { FC } from "react";
import { User } from "../../types/Types";
import serverAPI from "../../helper/axios";
import validate, { validatePassword } from "../../helper/validation";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProfileCard: FC<{ user: User }> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const { verifyToken } = useContext(AuthContext)!;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    });
  };
  const handleSave = async () => {
    const { name, email, phoneNumber } = formData;
    if (!validate(name, email, phoneNumber)) {
      return;
    }
    try {
      const { data } = await serverAPI.post(
        "/user/edit",
        {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
        },
        {
          withCredentials: true,
        }
      );
      if (data.user) {
        console.log(data.message);
        toast.success(data.message);
      }

      verifyToken();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong, please try again.");
      }
    }
    console.log("Updated Data:", formData);
    setIsEditing(false);
  };
  const handlePasswordSave = async () => {
    const { newPassword, confirmPassword } = passwordData;
    if (!validatePassword(newPassword, confirmPassword)) {
      return;
    }
    try {
      const { data } = await serverAPI.post(
        "/user/edit-password",
        {
          password: newPassword,
          confirmPassword: confirmPassword,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      if (data.message) {
        console.log(data.message);
        toast.success(data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong, please try again.");
      }
    }
    setPasswordData({
      newPassword: "",
      confirmPassword: "",
    });
  };
  const profileOnClick = () => {
    setActiveTab("profile");
    setIsEditing(false);
  };
  const passwordOnclick = () => {
    setActiveTab("password");
    setIsEditing(true);
  };
  return (
    <div className="bg-white w-xl max-w-full shadow overflow-hidden sm:rounded-lg mr-auto mt-30 z-20 max-[896px]:mt-10 max-[936px]:ml-auto">
      {/* Tabs */}
      <div className="flex">
        <button
          className={`px-4 py-3 w-1/2 ${
            activeTab === "profile"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => profileOnClick()}
        >
          Profile
        </button>
        <button
          className={`px-4 py-3 w-1/2 ${
            activeTab === "password"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => passwordOnclick()}
        >
          Change Password
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div>
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Profile Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Details and information about the user.
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="border-t border-gray-200">
            <ProfileField
              label="Full Name"
              name="name"
              value={formData.name}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <ProfileField
              label="Email Address"
              name="email"
              value={formData.email}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <ProfileField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <ProfileField label="Role" value={user.role} isEditing={false} />
          </div>

          {isEditing && (
            <div className="p-4 flex justify-end gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={cancelEditing}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === "password" && (
        <div className="">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Change Password
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter a new password to update your account.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <ProfileField
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              isEditing={isEditing}
              onChange={handlePasswordChange}
            />
            <ProfileField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              isEditing={isEditing}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="m-4 flex justify-end gap-2">
            <button
              onClick={handlePasswordSave}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
