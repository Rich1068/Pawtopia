import { useState } from "react";
import toast from "react-hot-toast";
import { sendEmail } from "../../helper/email";

interface IContactData {
  fullname: string;
  email: string;
  message: string;
}

const ContactSection = () => {
  const [contactData, setContactData] = useState<IContactData>({
    fullname: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendEmail(
        contactData.fullname,
        contactData.email,
        contactData.message
      );
      toast.success("Email sent successfully!");
      setContactData({ fullname: "", email: "", message: "" });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log(error);
      toast.error("Failed to send email");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 z-30 -mt-35">
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
              contact@example.com
            </p>
            <p className="text-gray-700">
              <span className="text-orange-500 font-semibold">Phone:</span> +123
              456 7890
            </p>
            <p className="text-gray-700">
              <span className="text-orange-500 font-semibold">Address:</span>{" "}
              123 Main St, City, Country
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
              onChange={(e) =>
                setContactData({ ...contactData, fullname: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              value={contactData.email}
              onChange={(e) =>
                setContactData({ ...contactData, email: e.target.value })
              }
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              value={contactData.message}
              onChange={(e) =>
                setContactData({ ...contactData, message: e.target.value })
              }
            ></textarea>
            <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
