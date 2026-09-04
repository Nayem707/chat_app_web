import { apiSlice } from "@/services/apiSlice";

export const friendApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query({
      query: () => "/friends",
      providesTags: ["Friend"],
    }),

    getIncomingRequests: builder.query({
      query: () => "/friends/requests/incoming",
      providesTags: ["FriendRequest"],
    }),

    getSentRequests: builder.query({
      query: () => "/friends/requests/sent",
      providesTags: ["FriendRequest"],
    }),

    getFriendStatus: builder.query({
      query: (userId) => `/friends/status/${userId}`,
      providesTags: (_r, _e, userId) => [{ type: "FriendStatus", id: userId }],
    }),

    sendFriendRequest: builder.mutation({
      query: ({ recipientId }) => ({
        url: "/friends/request",
        method: "POST",
        body: { recipientId },
      }),
      invalidatesTags: (_r, _e, { recipientId }) => [
        "FriendRequest",
        { type: "FriendStatus", id: recipientId },
      ],
    }),

    acceptFriendRequest: builder.mutation({
      query: ({ requestId }) => ({
        url: `/friends/${requestId}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: ["Friend", "FriendRequest", "FriendStatus"],
    }),

    rejectFriendRequest: builder.mutation({
      query: ({ requestId }) => ({
        url: `/friends/${requestId}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["FriendRequest", "FriendStatus"],
    }),

    cancelFriendRequest: builder.mutation({
      query: ({ requestId }) => ({
        url: `/friends/${requestId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FriendRequest", "FriendStatus"],
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useGetIncomingRequestsQuery,
  useGetSentRequestsQuery,
  useGetFriendStatusQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useCancelFriendRequestMutation,
} = friendApi;
