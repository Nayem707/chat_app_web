import { apiSlice } from "@/services/apiSlice";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => "/conversations",
      providesTags: ["Conversation"],
    }),
    createConversation: builder.mutation({
      query: (payload) => ({
        url: "/conversations",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Conversation", "Message"],
    }),
    getConversation: builder.query({
      query: (id) => `/conversations/${id}`,
      providesTags: (result, error, id) => [{ type: "Conversation", id }],
    }),
    getMessages: builder.query({
      query: ({ conversationId, page = 1, limit = 20 }) =>
        `/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}:${queryArgs?.conversationId}`,
      // On page 1 replace the cache; on later pages append (infinite scroll).
      merge: (currentCache, newItems, { arg }) => {
        const newData = newItems?.data;
        if (!newData?.items) return currentCache;
        if ((arg.page ?? 1) <= 1) return newItems;
        return {
          ...newItems,
          data: {
            ...newData,
            items: [...(currentCache?.data?.items ?? []), ...newData.items],
          },
        };
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page,
      providesTags: ["Message"],
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, content }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: "POST",
        body: { content },
      }),
      // Optimistically append the message so it appears immediately.
      async onQueryStarted(
        { conversationId, content, optimisticMessage },
        { dispatch, queryFulfilled },
      ) {
        if (!optimisticMessage) return;
        const cacheKey = { conversationId, page: 1, limit: 50 };
        const patch = dispatch(
          chatApi.util.updateQueryData("getMessages", cacheKey, (draft) => {
            if (draft?.data?.items) draft.data.items.push(optimisticMessage);
          }),
        );
        try {
          const { data: result } = await queryFulfilled;
          // Replace temp entry with the real server message.
          dispatch(
            chatApi.util.updateQueryData("getMessages", cacheKey, (draft) => {
              if (!draft?.data?.items) return;
              const idx = draft.data.items.findIndex(
                (m) => m.id === optimisticMessage.id,
              );
              if (idx !== -1) draft.data.items[idx] = result.data;
            }),
          );
        } catch {
          patch.undo();
        }
      },
      // Only refresh the sidebar preview; message cache is updated above.
      invalidatesTags: ["Conversation"],
    }),
    editMessage: builder.mutation({
      query: ({ conversationId, messageId, content }) => ({
        url: `/conversations/${conversationId}/messages/${messageId}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: ["Message"],
    }),
    deleteMessage: builder.mutation({
      query: ({ conversationId, messageId }) => ({
        url: `/conversations/${conversationId}/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Message"],
    }),
    createGroup: builder.mutation({
      query: (payload) => ({
        url: "/groups",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Conversation", "Group"],
    }),
    updateGroup: builder.mutation({
      query: ({ groupId, ...payload }) => ({
        url: `/groups/${groupId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Conversation", "Group"],
    }),
    addGroupMembers: builder.mutation({
      query: ({ groupId, memberIds }) => ({
        url: `/groups/${groupId}/members`,
        method: "POST",
        body: { memberIds },
      }),
      invalidatesTags: ["Conversation", "Group"],
    }),
    removeGroupMember: builder.mutation({
      query: ({ groupId, memberId }) => ({
        url: `/groups/${groupId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conversation", "Group"],
    }),
    getGroup: builder.query({
      query: (groupId) => `/groups/${groupId}`,
      providesTags: (result, error, groupId) => [
        { type: "Group", id: groupId },
      ],
    }),
    leaveGroup: builder.mutation({
      query: (groupId) => ({
        url: `/groups/${groupId}/leave`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conversation", "Group"],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetConversationQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useAddGroupMembersMutation,
  useRemoveGroupMemberMutation,
  useGetGroupQuery,
  useLeaveGroupMutation,
} = chatApi;
