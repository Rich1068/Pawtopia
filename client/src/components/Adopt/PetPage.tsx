import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
//TODO Need to create a new schema for pet since API doesnt have Description and other stuff
const PetPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the pet ID from the URL

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition duration-200"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back
      </button>
      <h1 className="text-2xl font-bold text-gray-800">Pet Details</h1>
      <p className="text-gray-600">Pet ID: {id}</p>
    </div>
  );
};

export default PetPage;
