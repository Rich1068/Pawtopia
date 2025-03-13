import ForgotPasswordSection from "../components/ForgotPassword/ForgotPasswordSection";
import PageHeader from "../components/PageHeader";

const ForgotPassword = () => {
  return (
    <>
      <div className=" min-w-full min-h-screen">
        <PageHeader />
        <div className="relative z-50">
          <ForgotPasswordSection />
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
