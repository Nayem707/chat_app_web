import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccessToken } from "@/features/auth/authSelectors";
import { PATHS } from "../routePaths";

/** Redirects authenticated users away from public-only pages (login, register). */
export const PublicRoute = () => {
  const token = useSelector(selectAccessToken);
  return token ? <Navigate to={PATHS.CHAT} replace /> : <Outlet />;
};
