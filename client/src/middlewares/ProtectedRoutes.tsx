import { Navigate, Outlet } from "react-router";
import { FC } from "react";
import { useAuth } from "../context/AuthContext";
type IProtectedRoute = ("user" | "admin")[];

export const ProtectedRoute: FC<{ allowedRoles?: IProtectedRoute }> = ({
  allowedRoles = ["user", "admin"],
}) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role))
    return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
