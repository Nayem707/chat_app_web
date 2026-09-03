import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccessToken } from "@/features/auth/authSelectors";
import { PATHS } from "../routePaths";

/** Blocks unauthenticated users; redirects them to /login. */
export const ProtectedRoute = () => {
  const token = useSelector(selectAccessToken);
  return token ? <Outlet /> : <Navigate to={PATHS.LOGIN} replace />;
};
