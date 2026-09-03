import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    drafts: {}, // conversationId → draft string
    typingUsers: {}, // conversationId → userId[]
  },
  reducers: {
    setDraft(state, { payload: { conversationId, draft } }) {
      state.drafts[conversationId] = draft;
    },
    clearDraft(state, { payload: conversationId }) {
      delete state.drafts[conversationId];
    },
    setTypingUsers(state, { payload: { conversationId, userIds } }) {
      state.typingUsers[conversationId] = userIds;
    },
    setUserTyping(state, { payload: { conversationId, userId, isTyping } }) {
      const current = state.typingUsers[conversationId] ?? [];
      if (isTyping) {
        if (!current.includes(userId))
          state.typingUsers[conversationId] = [...current, userId];
      } else {
        state.typingUsers[conversationId] = current.filter(
          (id) => id !== userId,
        );
      }
    },
  },
});

export const { setDraft, clearDraft, setTypingUsers, setUserTyping } =
  chatSlice.actions;
export const selectDraft = (conversationId) => (state) =>
  state.chat.drafts[conversationId] ?? "";
export const selectTypingUsers = (conversationId) => (state) =>
  state.chat.typingUsers[conversationId] ?? [];
export default chatSlice.reducer;
