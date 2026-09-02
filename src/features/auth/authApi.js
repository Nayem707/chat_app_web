import { apiSlice } from "@/services/apiSlice";
import { setCredentials, clearCredentials } from "@/features/auth/authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.data.accessToken }));
        } catch {}
      },
      invalidatesTags: ["Auth", "User", "Conversation", "Message", "Group"],
    }),
    login: builder.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.data.accessToken }));
        } catch {}
      },
      invalidatesTags: ["Auth", "User", "Conversation", "Message", "Group"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Clear token regardless of whether the server-side revocation succeeded.
          dispatch(clearCredentials());
        }
      },
      invalidatesTags: ["Auth", "User", "Conversation", "Message", "Group"],
    }),
    getCurrentUser: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth", "User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;
