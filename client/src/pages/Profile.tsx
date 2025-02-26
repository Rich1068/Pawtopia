import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileCard from "../components/Profile/ProfileCard";
import ProfileImageCard from "../components/Profile/ProfileImageCard";

const Profile = () => {
  const { user } = useContext(AuthContext)!;

  return (
    <>
      {user && (
        <>
          <div className="relative h-[240px] bg-orange-600 z-10 font-secondary">
            <div>
              <div className="flex items-start flex-wrap content-center">
                <ProfileImageCard user={user} />
                <ProfileCard user={user} />
              </div>
            </div>
          </div>
          <div className="fixed inset-0 min-w-full min-h-full bg-cover md:bg-contain bg-[url(/assets/img/wallpaper.jpg)]"></div>
        </>
      )}
    </>
  );
};

export default Profile;
