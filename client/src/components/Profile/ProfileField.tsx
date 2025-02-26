import { FC } from "react";
interface IFormInput {
  label: string;
  name?: string;
  value: string;
  isEditing: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const ProfileField: FC<IFormInput> = ({
  label,
  name,
  value,
  isEditing,
  onChange,
}) => {
  return (
    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {isEditing && name ? (
          <input
            type="text"
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
