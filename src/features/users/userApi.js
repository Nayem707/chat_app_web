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
      invalidatesTags: ["User", "Auth"],
    }),
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: "/users/me/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User", "Auth"],
    }),
    uploadCover: builder.mutation({
      query: (formData) => ({
        url: "/users/me/cover",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User", "Auth"],
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
  useUploadAvatarMutation,
  useUploadCoverMutation,
  useSearchUsersQuery,
} = userApi;
