import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectAccessToken } from "@/features/auth/authSlice";

/** Blocks authenticated users from public-only pages; redirects them to /chat. */
export const PublicRoute = () => {
  const token = useSelector(selectAccessToken);
  return token ? <Navigate to="/chat" replace /> : <Outlet />;
};
