import { apiSlice } from "@/services/apiSlice";
import authReducer from "@/features/auth/authSlice";
import chatReducer from "@/features/chat/chatSlice";
import settingsReducer from "@/features/settings/settingsSlice";

export const rootReducer = {
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  chat: chatReducer,
  settings: settingsReducer,
};
