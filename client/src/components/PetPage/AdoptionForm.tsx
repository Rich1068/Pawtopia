import { useState } from "react";
import serverAPI from "../../helper/axios";
import { useAuth } from "../../context/AuthContext";
import {
  validateField,
  validateForm,
  ValidationErrors,
} from "../../helper/validation";
import toast from "react-hot-toast";

interface AdoptionFormProps {
  petId: string;
  petName: string;
}

const AdoptionForm: React.FC<AdoptionFormProps> = ({ petId, petName }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: "",
    livingSituation: "",
    otherLivingSituation: "",
    mode: "",
    otherMode: "",
    experience: "",
    reason: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    console.log("Validation Errors:", validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Form submitted");
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
      setSuccessMessage(
        "Your adoption request has been submitted!\nPlease Wait for a message on your mode of communication!"
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        livingSituation: "",
        otherLivingSituation: "",
        mode: "",
        otherMode: "",
        experience: "",
        reason: "",
      });
      setErrors({});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error submitting adoption request:", error);
      toast.error(error.response.data.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(value !== "Other" && {
        [`other${name.charAt(0).toUpperCase() + name.slice(1)}`]: "",
      }), // Reset other field if not "Other"
    }));
  };

  return (
    <div className="my-6 p-6 border border-orange-300 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl md:text-3xl font-semibold text-orange-600 font-primary text-center">
        Adoption Request Form
      </h3>

      {successMessage ? (
        <p
          style={{ whiteSpace: "pre-line" }}
          className="text-green-600 mt-4 text-center font-medium font-secondary"
        >
          {successMessage}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-6 px-6 font-secondary"
        >
          <div>
            <label className="text-orange-700 font-medium">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border-b-2 border-orange-400 bg-transparent text-amber-950 focus:outline-none focus:ring-0 focus:border-orange-600 transition"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email & Phone - Side by Side */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Email */}
            <div className="flex-1">
              <label className="text-orange-700 font-medium">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border-b-2 border-orange-400 bg-transparent text-amber-950 focus:outline-none focus:ring-0 focus:border-orange-600 transition"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex-1">
              <label className="text-orange-700 font-medium">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border-b-2 border-orange-400 bg-transparent text-amber-950 focus:outline-none focus:ring-0 focus:border-orange-600 transition"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Address Field */}
          <div>
            <label className="text-orange-700 font-medium">Your Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border-b-2 border-orange-400 bg-transparent text-amber-950 focus:outline-none focus:ring-0 focus:border-orange-600 transition"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          {/* Living Situation */}
          <div>
            <label className="text-orange-700 font-medium">
              Living Situation
            </label>
            <div className="flex flex-col sm:flex-row gap-4 mt-2 text-amber-950">
              {["House", "Apartment", "Other"].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="livingSituation"
                    value={option}
                    checked={formData.livingSituation === option}
                    onChange={handleRadioChange}
                    className="accent-orange-500"
                  />
                  {option}
                </label>
              ))}
              {formData.livingSituation === "Other" && (
                <input
                  type="text"
                  name="otherLivingSituation"
                  value={formData.otherLivingSituation}
                  onChange={handleChange}
                  placeholder="Please specify..."
                  className="max-w-40 border-b-2 border-orange-400 bg-transparent text-amber-950 focus:outline-none focus:ring-0 focus:border-orange-600 transition"
                />
              )}
            </div>

            {errors.livingSituation && (
              <p className="text-red-500 text-sm">{errors.livingSituation}</p>
            )}
          </div>

          {/* Mode of Communication */}
          <div>
            <label className="text-orange-700 font-medium">
              Mode of Communication
            </label>
            <div className="flex flex-col sm:flex-row gap-4 mt-2 text-amber-950">
              {["Email", "Phone", "Other"].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value={option}
                    checked={formData.mode === option}
                    onChange={handleRadioChange}
                    className="accent-orange-500"
                  />
                  {option}
                </label>
              ))}
              {formData.mode === "Other" && (
                <input
                  type="text"
                  name="otherMode"
                  value={formData.otherMode}
                  onChange={handleChange}
                  placeholder="Please specify..."
                  className="max-w-40 border-b-2 border-orange-400 bg-transparent text-amber-950 focus:outline-none focus:ring-0 focus:border-orange-600 transition"
                />
              )}
            </div>

            {errors.mode && (
              <p className="text-red-500 text-sm">{errors.mode}</p>
            )}
          </div>
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
              placeholder="Please describe in at least 10 characters why you want to adopt this pet."
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
