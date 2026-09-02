import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || '/api';

/**
 * Central RTK Query slice.
 * Feature endpoints are injected via `apiSlice.injectEndpoints(...)` from each feature.
 */
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include', // HTTP-only auth cookies
  }),
  tagTypes: ['Auth', 'User', 'Conversation', 'Message', 'Group'],
  endpoints: () => ({}),
});
