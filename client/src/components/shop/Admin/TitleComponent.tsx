import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { FC } from "react";

const TitleComponent: FC<{ text: string }> = ({ text }) => {
  const navigate = useNavigate();
  return (
    <h2 className="text-3xl sm:text-4xl font-semibold mb-4 font-primary text-orange-600">
      <div className="flex items-center gap-x-2">
        <ArrowLeft size={30} onClick={() => navigate(-1)} />
        <span>{text}</span>
      </div>
    </h2>
  );
};

export default TitleComponent;
