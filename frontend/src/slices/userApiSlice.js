import {apiSlice} from './apiSlice';
import {USERS_URL} from '../constants';


const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //Get users
        getUsers: builder.query({
            query: () => ({
                url: USERS_URL,
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Users']
        }),
        //Get user by Id
        getUserById: builder.query({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,  
            }),
            keepUnusedDataFor: 5
        }),
        //Get User profile
        getprofile: builder.query({
            query: () => ({
                url: `${USERS_URL}/profile`
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Users']
        }),
        // Update User profile
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['User']//To clear the cache
        }),
        //Delete user
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'DELETE'
            }),
        }),
        //Follow user
        follow: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/follow`,
                method: 'PUT',
            })
        }),
        //Unfollow user
        unfollow: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/unfollow`,
                method: 'PUT',
            })
        }),
        //block user
        blockuser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/blockuser/${data.userId}`,
                method: 'PUT',
                body: data
            })
        }),
        //unblock user
        unblockuser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/unblockuser/${data.userId}`,
                method: 'PUT',
                body: data
            })
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetprofileQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetUserByIdQuery,
    useFollowMutation,
    useUnfollowMutation,
    useBlockuserMutation,
    useUnblockuserMutation,
} = userApiSlice;