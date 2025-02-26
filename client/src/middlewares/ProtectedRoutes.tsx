import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { FC, useContext } from "react";

type Props = "user" | "admin";

export const ProtectedRoute: FC<{ allowedRoles: Props }> = ({
  allowedRoles,
}) => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthProvider"
    );
  }
  const { user, loading } = auth;
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
