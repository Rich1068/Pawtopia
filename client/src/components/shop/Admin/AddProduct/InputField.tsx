interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => {
  return (
    <div className="mb-2">
      <label className=" font-primary text-lg text-amber-950">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 my-2 border border-gray-300 rounded-lg font-primary text-amber-950  placeholder-gray-400/70"
        required
      />
    </div>
  );
};

export default InputField;
