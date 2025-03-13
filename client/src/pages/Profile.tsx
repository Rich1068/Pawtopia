import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileCard from "../components/Profile/ProfileCard";
import ProfileImageCard from "../components/Profile/ProfileImageCard";
import PageHeader from "../components/PageHeader";

const Profile = () => {
  const { user } = useContext(AuthContext)!;

  return (
    <>
      {user && (
        <>
          <div className=" min-w-full min-h-screen">
            <PageHeader />
            <div className="flex items-start flex-wrap max-lg:flex-col content-center relative -mt-30 max-md:-mt-40 z-50">
              <ProfileImageCard user={user} />
              <ProfileCard user={user} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
