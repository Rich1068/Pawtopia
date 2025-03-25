import { useState, useEffect } from "react";
import serverAPI from "../../helper/axios";
import { useAuth } from "../../context/AuthContext";
import {
  validateField,
  validateForm,
  ValidationErrors,
} from "../../helper/validation";

interface AdoptionFormProps {
  petId: string;
  petName: string;
}

const AdoptionForm: React.FC<AdoptionFormProps> = ({ petId, petName }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    livingSituation: "",
    experience: "",
    reason: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      const newErrors = { ...errors, [name]: validateField(name, value) };
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await serverAPI.post(
        "/adopt/create-request",
        {
          ...formData,
          petId,
          petName,
        },
        { withCredentials: true }
      );
      setSuccessMessage("Your adoption request has been submitted!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        livingSituation: "",
        experience: "",
        reason: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting adoption request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-6 p-6 border border-orange-300 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl md:text-3xl font-semibold text-orange-600 font-primary text-center">
        Adoption Request Form
      </h3>

      {successMessage ? (
        <p className="text-green-600 mt-4 text-center font-medium font-secondary">
          {successMessage}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-6 px-6">
          {[
            { label: "Your Name", name: "name", type: "text" },
            { label: "Email Address", name: "email", type: "email" },
            { label: "Phone Number", name: "phone", type: "text" },
            { label: "Your Address", name: "address", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="text-orange-700 font-medium">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full p-2 border-b-2 border-orange-400 bg-transparent text-amber-950 focus:outline-none focus:ring-0 focus:border-orange-600 transition"
              />
              {errors[name] && (
                <p className="text-red-500 text-sm">{errors[name]}</p>
              )}
            </div>
          ))}

          {/* Living Situation */}
          <div>
            <label className="text-orange-700 font-medium">
              Living Situation
            </label>
            <div className="flex gap-4 mt-2 text-amber-950">
              {["House", "Apartment", "Other"].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="livingSituation"
                    value={option}
                    checked={formData.livingSituation === option}
                    onChange={handleChange}
                    className="accent-orange-500"
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.livingSituation && (
              <p className="text-red-500 text-sm">{errors.livingSituation}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="text-orange-700 font-medium">
              Experience with Pets
            </label>
            <div className="flex flex-col sm:flex-row gap-4 mt-2 text-amber-950">
              {[
                "First-time pet owner",
                "Had pets before",
                "Currently have pets",
              ].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="experience"
                    value={option}
                    checked={formData.experience === option}
                    onChange={handleChange}
                    className="accent-orange-500"
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.experience && (
              <p className="text-red-500 text-sm">{errors.experience}</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="text-orange-700 font-medium">
              Why do you want to adopt this pet?
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Please describe in at least 10 words why you want to adopt this pet."
              className="w-full mt-2 p-2 border border-orange-400 bg-transparent text-amber-950 focus:outline-none focus:ring-0 focus:border-orange-600 transition"
            />
            {errors.reason && (
              <p className="text-red-500 text-sm">{errors.reason}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-full max-w-80 mx-auto px-6 py-3 bg-orange-500 text-white font-semibold rounded-3xl shadow-md hover:bg-orange-600 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdoptionForm;
