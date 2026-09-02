import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/layouts/RootLayout";
import { AuthPage } from "@/pages/AuthPage";
import { ChatPage } from "@/pages/ChatPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Auth-only: redirect to /chat if already signed in
      {
        element: <PublicRoute />,
        children: [
          { path: "/", element: <AuthPage mode="login" /> },
          { path: "/login", element: <AuthPage mode="login" /> },
          { path: "/register", element: <AuthPage mode="register" /> },
        ],
      },

      // Protected: redirect to /login if not signed in
      {
        element: <ProtectedRoute />,
        children: [{ path: "/chat", element: <ChatPage /> }],
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
