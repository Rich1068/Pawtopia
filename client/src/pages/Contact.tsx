import ContactSection from "../components/Contact/ContactSection";
import PageHeader from "../components/PageHeader";

const Contact = () => {
  return (
    <>
      <div className="fixed inset-0 min-w-full min-h-full pt-18">
        <PageHeader />
        <div className="relative z-100">
          <ContactSection />
        </div>
      </div>
    </>
  );
};

export default Contact;
