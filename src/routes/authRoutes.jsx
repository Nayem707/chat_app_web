import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { PATHS } from "./routePaths";

export const authRoutes = [
  { path: PATHS.LOGIN, element: <LoginPage /> },
  { path: PATHS.REGISTER, element: <RegisterPage /> },
];
