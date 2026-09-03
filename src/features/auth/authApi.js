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
      // Store the token on success; errors bubble up to the calling component.
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.data.accessToken }));
        } catch (_err) {
          // Intentional: registration errors are handled by the component via action.error.
        }
      },
      invalidatesTags: ["Auth", "User", "Conversation", "Message", "Group"],
    }),

    login: builder.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
      // Store the token on success; errors bubble up to the calling component.
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.data.accessToken }));
        } catch (_err) {
          // Intentional: login errors are handled by the component via action.error.
        }
      },
      invalidatesTags: ["Auth", "User", "Conversation", "Message", "Group"],
    }),

    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      // Clear credentials regardless of server response (network errors, 401, etc.)
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
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
