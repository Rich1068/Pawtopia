import { useAuth } from "../../context/AuthContext";
import { useAdoptionForm } from "../../hooks/useAdoptionForm";

interface AdoptionFormProps {
  petId: string;
  petName: string;
}

const AdoptionForm: React.FC<AdoptionFormProps> = ({ petId, petName }) => {
  const { user } = useAuth();

  const {
    formData,
    errors,
    successMessage,
    isSubmitting,
    handleChange,
    handleRadioChange,
    handleSubmit,
  } = useAdoptionForm({ petId, petName, user });

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
              data-testid="name-input"
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
                data-testid="email-input"
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
                data-testid="phone-input"
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
              data-testid="address-input"
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
                    data-testid={`${option}-situation-input`}
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
                  data-testid="situation-other-input"
                  value={formData.otherLivingSituation}
                  onChange={handleChange}
                  placeholder="Please specify..."
                  className="max-w-40 border-b-2 border-orange-400 bg-transparent text-amber-950 focus:outline-none focus:ring-0 focus:border-orange-600 transition"
                />
              )}
            </div>

            {(errors.livingSituation || errors.otherLivingSituation) && (
              <p className="text-red-500 text-sm">
                {errors.livingSituation || errors.otherLivingSituation}
              </p>
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
                    data-testid={`${option}-mode-input`}
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
                  data-testid="mode-other-input"
                  value={formData.otherMode}
                  onChange={handleChange}
                  placeholder="Please specify..."
                  className="max-w-40 border-b-2 border-orange-400 bg-transparent text-amber-950 focus:outline-none focus:ring-0 focus:border-orange-600 transition"
                />
              )}
            </div>

            {(errors.mode || errors.otherMode) && (
              <p className="text-red-500 text-sm">
                {errors.mode || errors.otherMode}
              </p>
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
                    data-testid={`${option}-experience-input`}
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
              data-testid="reason-input"
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
            data-testid="submit-button"
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
