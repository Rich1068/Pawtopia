import { FC } from "react";

interface IFormInput {
  label: string;
  name?: string;
  value: string;
  type?: string;
  isEditing: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileField: FC<IFormInput> = ({
  label,
  name,
  value,
  type = "text",
  isEditing,
  onChange,
}) => {
  return (
    <div className="bg-gray-50 px-4 py-5 grid grid-cols-3 gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 col-span-2 w-[80%]">
        {isEditing && name ? (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="border p-1 rounded w-full"
          />
        ) : (
          value
        )}
      </dd>
    </div>
  );
};

export default ProfileField;
