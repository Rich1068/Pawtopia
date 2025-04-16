import { FC } from "react";
interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

const InputField: FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => {
  return (
    <div className="mb-2">
      <label htmlFor={name} className=" font-primary text-lg text-amber-950">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 my-2 border border-gray-300 rounded-lg font-primary text-amber-950  placeholder-gray-400/70"
        required
        data-testid={`input-${name}`}
      />
    </div>
  );
};

export default InputField;
