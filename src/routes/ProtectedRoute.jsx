import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectAccessToken } from "@/features/auth/authSlice";

/** Blocks unauthenticated users; redirects them to /login. */
export const ProtectedRoute = () => {
  const token = useSelector(selectAccessToken);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
