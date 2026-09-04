export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",

  CHAT: "/chat",
  CONVERSATION: "/chat/:conversationId",
  conversationById: (id) => `/chat/${id}`,

  USERS: "/users",
  FRIENDS: "/friends",

  GROUPS: "/groups",
  CREATE_GROUP: "/groups/create",
  GROUP_DETAILS: "/groups/:groupId",
  groupById: (id) => `/groups/${id}`,

  SETTINGS: "/settings",
  SETTINGS_PROFILE: "/settings/profile",
  SETTINGS_ACCOUNT: "/settings/account",
  SETTINGS_PRIVACY: "/settings/privacy",
  SETTINGS_NOTIFICATIONS: "/settings/notifications",
  SETTINGS_SECURITY: "/settings/security",
  SETTINGS_APPEARANCE: "/settings/appearance",
};
