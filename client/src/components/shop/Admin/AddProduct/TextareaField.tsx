interface TextareaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="mb-2">
      <label className="font-primary text-lg text-amber-950">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full min-h-35 my-2 p-2 border border-gray-300 rounded-lg font-primary text-amber-950  placeholder-gray-400/70"
        required
      />
    </div>
  );
};

export default TextareaField;
