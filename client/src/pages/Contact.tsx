import ContactSection from "../components/Contact/ContactSection";
import PageHeader from "../components/PageHeader";

const Contact = () => {
  return (
    <>
      <div className=" min-w-full min-h-screen">
        <PageHeader />
        <div className="relative z-50">
          <ContactSection />
        </div>
      </div>
    </>
  );
};

export default Contact;
