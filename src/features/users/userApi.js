import { apiSlice } from "@/services/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({
        url: "/users/me",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    searchUsers: builder.query({
      query: (q = "") => `/users/search?q=${encodeURIComponent(q)}`,
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useSearchUsersQuery,
} = userApi;
