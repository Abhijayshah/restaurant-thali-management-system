import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import type { UserRole, AuthState } from "../types/auth";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const authState = useAppSelector((state) => state.auth) as AuthState;

  if (!authState.token || !authState.user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(authState.user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
