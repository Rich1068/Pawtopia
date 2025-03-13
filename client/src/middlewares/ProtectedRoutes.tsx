import { Navigate, Outlet } from "react-router";
import { FC } from "react";
import { useAuth } from "../context/AuthContext";
type Props = "user" | "admin";

export const ProtectedRoute: FC<{ allowedRoles: Props }> = ({
  allowedRoles,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    console.log("🔄 Loading user...");
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("🚫 No user found, redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log(allowedRoles);
    console.log(user);
    console.log(
      `⛔ Unauthorized: User role (${user.role}) is not in ${allowedRoles}`
    );
    return <Navigate to="/login" replace />;
  }

  console.log("✅ Access granted!");
  return <Outlet />;
};

export default ProtectedRoute;
