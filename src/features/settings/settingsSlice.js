import { createSlice } from "@reduxjs/toolkit";

const THEME_KEY = "chat_theme";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    theme: localStorage.getItem(THEME_KEY) || "dark",
  },
  reducers: {
    setTheme(state, { payload }) {
      state.theme = payload;
      localStorage.setItem(THEME_KEY, payload);
    },
  },
});

export const { setTheme } = settingsSlice.actions;
export const selectTheme = (state) => state.settings.theme;
export default settingsSlice.reducer;
