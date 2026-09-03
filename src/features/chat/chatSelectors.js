export const selectDraft = (conversationId) => (state) =>
  state.chat.drafts[conversationId] ?? "";

export const selectTypingUsers = (conversationId) => (state) =>
  state.chat.typingUsers[conversationId] ?? [];
