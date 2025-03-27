import PageHeader from "../../components/PageHeader";
import VerifyEmailSection from "../../components/VerifyEmail/VerifyEmailSection";

const VerifyEmail = () => {
  return (
    <>
      <div className=" min-w-full min-h-screen">
        <PageHeader />
        <div className="relative z-50">
          <VerifyEmailSection />
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
