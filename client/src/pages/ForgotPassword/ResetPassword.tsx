import ResetPasswordSection from "../../components/ForgotPassword/ResetPasswordSection";

import PageHeader from "../../components/PageHeader";

const ResetPassword = () => {
  return (
    <>
      <div className=" min-w-full min-h-screen">
        <PageHeader />

        <div className="relative z-50">
          <ResetPasswordSection />
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
