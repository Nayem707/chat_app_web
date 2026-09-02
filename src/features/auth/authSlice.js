import { createSlice } from "@reduxjs/toolkit";

const TOKEN_KEY = "chat_at";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Rehydrate from localStorage so the token survives page refreshes.
    accessToken: localStorage.getItem(TOKEN_KEY) || null,
  },
  reducers: {
    setCredentials(state, { payload }) {
      state.accessToken = payload.accessToken;
      localStorage.setItem(TOKEN_KEY, payload.accessToken);
    },
    clearCredentials(state) {
      state.accessToken = null;
      localStorage.removeItem(TOKEN_KEY);
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const selectAccessToken = (state) => state.auth.accessToken;
export default authSlice.reducer;
