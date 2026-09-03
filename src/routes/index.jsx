import { createBrowserRouter, Navigate } from "react-router-dom";

import { AuthLayout } from "@/layouts/AuthLayout";
import { AppLayout } from "@/layouts/AppLayout";
import { ChatLayout } from "@/layouts/ChatLayout";
import { SettingsLayout } from "@/layouts/SettingsLayout";

import { PublicRoute } from "./guard/publicRoutes";
import { ProtectedRoute } from "./guard/protectedRoutes";
import { authRoutes } from "./authRoutes";
import { PATHS } from "./routePaths";

import { ChatPage } from "@/pages/chat/ChatPage";
import { ConversationPage } from "@/pages/chat/ConversationPage";
import { NotFoundPage } from "@/pages/error/NotFoundPage";
import { UnauthorizedPage } from "@/pages/error/UnauthorizedPage";
import { GroupsPage } from "@/pages/groups/GroupsPage";
import { CreateGroupPage } from "@/pages/groups/CreateGroupPage";
import { GroupDetailsPage } from "@/pages/groups/GroupDetailsPage";
import {
  ProfileSettingsPage,
  AccountSettingsPage,
  PrivacySettingsPage,
  NotificationSettingsPage,
  SecuritySettingsPage,
  AppearanceSettingsPage,
} from "@/pages/settings/SettingsPages";

export const router = createBrowserRouter([
  // Root: redirect to /login
  {
    index: true,
    path: PATHS.HOME,
    element: <Navigate to={PATHS.LOGIN} replace />,
  },

  // Public routes — redirect to /chat if already signed in
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: authRoutes,
      },
    ],
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Chat — nested under ChatLayout so the sidebar is always visible
          {
            element: <ChatLayout />,
            children: [
              { path: PATHS.CHAT, element: <ChatPage /> },
              { path: PATHS.CONVERSATION, element: <ConversationPage /> },
            ],
          },

          // Groups
          { path: PATHS.GROUPS, element: <GroupsPage /> },
          { path: PATHS.CREATE_GROUP, element: <CreateGroupPage /> },
          { path: PATHS.GROUP_DETAILS, element: <GroupDetailsPage /> },

          // Settings — nested under SettingsLayout for the nav sidebar
          {
            element: <SettingsLayout />,
            children: [
              {
                path: PATHS.SETTINGS,
                element: <Navigate to={PATHS.SETTINGS_PROFILE} replace />,
              },
              {
                path: PATHS.SETTINGS_PROFILE,
                element: <ProfileSettingsPage />,
              },
              {
                path: PATHS.SETTINGS_ACCOUNT,
                element: <AccountSettingsPage />,
              },
              {
                path: PATHS.SETTINGS_PRIVACY,
                element: <PrivacySettingsPage />,
              },
              {
                path: PATHS.SETTINGS_NOTIFICATIONS,
                element: <NotificationSettingsPage />,
              },
              {
                path: PATHS.SETTINGS_SECURITY,
                element: <SecuritySettingsPage />,
              },
              {
                path: PATHS.SETTINGS_APPEARANCE,
                element: <AppearanceSettingsPage />,
              },
            ],
          },

          { path: "/unauthorized", element: <UnauthorizedPage /> },
        ],
      },
    ],
  },

  { path: PATHS.NOT_FOUND, element: <NotFoundPage /> },
]);
