import { createApi } from "@reduxjs/toolkit/query/react";

import { clearCredentials } from "@/features/auth/authSlice";
import { axiosInstance } from "./axiosInstance";
import { normalizeApiError } from "./apiErrorHandler";

/**
 * RTK Query base query backed by the shared axiosInstance.
 * Converts Axios responses/errors into the {data} / {error} shape RTK Query expects.
 */
const axiosBaseQuery = async (args, api) => {
  const {
    url,
    method = "GET",
    body,
    params,
  } = typeof args === "string" ? { url: args } : args;

  try {
    const response = await axiosInstance({ url, method, data: body, params });
    return { data: response.data };
  } catch (error) {
    const normalized = error?.isNormalized ? error : normalizeApiError(error);

    // Global 401 handler: clear credentials so ProtectedRoute redirects to login.
    if (normalized.statusCode === 401) {
      api.dispatch(clearCredentials());
    }

    return { error: normalized };
  }
};

/**
 * Central RTK Query slice.
 * Feature endpoints are injected via `apiSlice.injectEndpoints(...)` from each feature.
 */
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Auth", "User", "Conversation", "Message", "Group"],
  endpoints: () => ({}),
});
