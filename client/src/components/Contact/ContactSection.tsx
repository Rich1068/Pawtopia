import { useState } from "react";
import toast from "react-hot-toast";
import { sendEmail } from "../../helper/email";
import { useAuth } from "../../context/AuthContext";
import WarningModal from "../WarningModal";
import { useNavigate } from "react-router";

interface IContactData {
  fullname: string;
  email: string;
  message: string;
}

const ContactSection = () => {
  const navigate = useNavigate();
  const [contactData, setContactData] = useState<IContactData>({
    fullname: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user) {
      setIsModalOpen(true);
      setIsLoading(false);
      return;
    }
    if (!contactData.fullname || !contactData.email || !contactData.message) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }

    if (contactData.email && !emailCheck.test(contactData.email)) {
      toast.error("Invalid Email Format");
      setIsLoading(false);
      return;
    }

    try {
      await sendEmail(
        contactData.fullname,
        contactData.email,
        contactData.message
      );
      toast.success("Email sent successfully!");
      setContactData({ fullname: "", email: "", message: "" });
    } catch (error) {
      console.log(error);
      toast.error("Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 z-30 -mt-35 max-md:-mt-40">
      <div className="bg-white shadow-lg rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side - Contact Information */}
        <div className="font-primary">
          <img src="/assets/img/Logo1.png" className="h-20 w-20 mx-auto" />
          <h2 className="text-3xl font-semibold text-orange-500">
            Get in Touch
          </h2>
          <p className="mt-4 text-gray-600">
            Have questions or need assistance? Fill out the form, and we'll get
            back to you as soon as possible.
          </p>
          <div className="mt-6 space-y-2">
            <p className="text-gray-700">
              <span className="text-orange-500 font-semibold">Email:</span>{" "}
              pawtopia21@gmail.com
            </p>
            <p className="text-gray-700">
              <span className="text-orange-500 font-semibold">Phone:</span> +63
              977 268 5577
            </p>
            <p className="text-gray-700">
              <span className="text-orange-500 font-semibold">Address:</span>{" "}
              Jose Abad Santos Ave, Clark Freeport, Mabalacat, Pampanga
            </p>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div>
          <h3 className="text-2xl font-medium text-orange-500 mb-4 font-primary">
            Contact Us
          </h3>
          <form className="space-y-4 font-secondary" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              value={contactData.fullname}
              data-testid="fullname-form"
              onChange={(e) =>
                setContactData({ ...contactData, fullname: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Email Address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              value={contactData.email}
              data-testid="email-form"
              onChange={(e) =>
                setContactData({ ...contactData, email: e.target.value })
              }
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              value={contactData.message}
              data-testid="message-form"
              onChange={(e) =>
                setContactData({ ...contactData, message: e.target.value })
              }
            ></textarea>
            <button
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
              disabled={isLoading}
              data-testid="contact-submit-button"
            >
              {isLoading ? (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="white"
                  />
                </svg>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
      <WarningModal
        header="Login Required"
        text="Please Login to Submit"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        confirmText="Log In"
        onConfirm={() => navigate("/login")}
      />
    </div>
  );
};

export default ContactSection;
