import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearCredentials } from "@/features/auth/authSlice";

const baseUrl = import.meta.env.VITE_API_URL || "/api";

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    headers.set("Accept", "application/json");
    const token = getState().auth?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const customBaseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }

  return result;
};

/**
 * Central RTK Query slice.
 * Feature endpoints are injected via `apiSlice.injectEndpoints(...)` from each feature.
 */
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["Auth", "User", "Conversation", "Message", "Group"],
  endpoints: () => ({}),
});
