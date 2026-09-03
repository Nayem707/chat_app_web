import axios from "axios";

import { API_URL } from "@/constants";
import { normalizeApiError } from "./apiErrorHandler";

// Store reference set via injectStore() in App.jsx to avoid a circular import
// (store → apiSlice → axiosInstance → store).
let _store;
export const injectStore = (store) => {
  _store = store;
};

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach the JWT access token to every outgoing request.
axiosInstance.interceptors.request.use((config) => {
  const token = _store?.getState().auth?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize all error responses into a consistent shape before they propagate.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error)),
);
