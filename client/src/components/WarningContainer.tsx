import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";

interface IWarningContainer {
  header?: string;
  text?: string;
  confirmText?: string;
  onConfirm?: () => void;
}
export const WarningContainer: FC<IWarningContainer> = ({
  header,
  text,
  confirmText = "Confirm",
  onConfirm,
}) => {
  return (
    <div className="absolute left-0 right-0 py-10 flex items-center justify-center z-[999]">
      <div className="bg-white w-96 flex flex-col p-6 rounded-lg shadow-lg max-w-sm font-primary">
        <div className="text-orange-600 flex flex-col items-center text-center">
          <FontAwesomeIcon icon={faPaw} size="3x" />
          <h2 className="text-2xl font-semibold text-gray-700">{header}</h2>
          <p className="text-gray-500">{text}</p>
          {onConfirm ? (
            <div className="flex gap-x-5 mt-4">
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer 
                   hover:bg-orange-600 transition duration-300"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default WarningContainer;
