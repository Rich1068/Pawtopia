import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileCard from "../components/Profile/ProfileCard";

const Profile = () => {
  const { user } = useContext(AuthContext)!;

  return (
    <>
      {user && (
        <>
          <div className="relative h-[240px] bg-orange-600 z-10 font-secondary">
            <ProfileCard user={user} />
          </div>
          <div className="absolute bottom-0 min-w-full min-h-full bg-cover md:bg-contain bg-[url(/assets/img/wallpaper.jpg)]"></div>
        </>
      )}
    </>
  );
};

export default Profile;
