import { useState } from "react";
import ProfileField from "./ProfileField";
import { FC } from "react";
import { User } from "../../types/Types";
import serverAPI from "../../helper/axios";
const ProfileCard:FC<{user: User}> = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        // TODO: Send updated data to backend
        try {
            serverAPI.post('/user/edit', {
                name: formData.name,
                email: formData.email
            }, {
                withCredentials: true
            })
        } catch (error) {
            console.log(error)
        }
        console.log("Updated Data:", formData);
        setIsEditing(false);
    };

    return (
        <div className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg mt-30 absolute z-20 mx-auto left-0 right-0">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
                    <p className="mt-1 text-sm text-gray-500">Details and information about user.</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                    {isEditing ? "Cancel" : "Edit"}
                </button>
            </div>

            <div className="border-t border-gray-200">
                <ProfileField label="Full Name" name="name" value={formData.name} isEditing={isEditing} onChange={handleChange} />
                <ProfileField label="Email Address" name="email" value={formData.email} isEditing={isEditing} onChange={handleChange} />
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
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
