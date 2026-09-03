import { useSelector } from "react-redux";
import {
  selectAccessToken,
  selectIsAuthenticated,
} from "@/features/auth/authSelectors";

export const useAuth = () => {
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return { accessToken, isAuthenticated };
};
