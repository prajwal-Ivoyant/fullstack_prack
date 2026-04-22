
import { api } from "./api";

import type { Post } from "../components/Posts";

export const postApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getPosts: builder.query<Post[], void>({
            query: () => "/posts",
            transformResponse: (response: any) => response.data,
            providesTags:["Posts"]
        }),

        createPost: builder.mutation<
            any,
            { title: string; content: string }
        >({
            query: (body) => ({
                url: "/posts",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Posts"]
        }),

        updatePost: builder.mutation<
            any,
            { id: string, title: string, content: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/posts/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ["Posts"]
        }),

        deletePost: builder.mutation<any, string>({
            query: (id) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Posts"]
        })

    }),
});

export const {
    useGetPostsQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = postApi;