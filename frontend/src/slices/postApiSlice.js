import {apiSlice} from './apiSlice';
import {POSTS_URL} from '../constants';



export const postApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //Create post
        createpost: builder.mutation({
            query: (data) => ({
                url: POSTS_URL,
                method: 'POST',
                body: data
            }),
        }),
        //Get all posts
        getposts: builder.query({
            query: () => ({
                url: POSTS_URL,
            }),
            providesTags: ['Posts'],
            keepUnusedDataFor: 5,
        }),
        //Get Post By Id
        getpost: builder.query({
            query: (postId) => ({
               url:  `${POSTS_URL}/${postId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        //Update Post
        updatepost: builder.mutation({
            query: (data) => ({
                url: `${POSTS_URL}/${data.postId}`,
                method: 'PUT',
                body: data
            }),
        }),
        //Delete post
        deletepost: builder.mutation({
            query: (postId) => ({
                url: `${POSTS_URL}/${postId}`,
                method: 'DELETE' 
            })
        }),
        //Likes Post
        likepost: builder.mutation({
            query: () => ({
                url: `${POSTS_URL}/likes`,
                method: 'PUT',
            }),
        }),
        //Dislikes Post
        dislikepost: builder.mutation({
            query: (data) => ({
                url: `${POSTS_URL}/dislikes`,
                method: 'PUT',
                body: data
            }),
        }),
    }),
});


export const {
    useCreatepostMutation,
    useGetpostsQuery,
    useGetpostQuery,
    useUpdatepostMutation,
    useDeletepostMutation,
    useLikepostMutation,
    useDislikepostMutation
} = postApiSlice;
