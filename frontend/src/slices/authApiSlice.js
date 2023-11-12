import {AUTH_URL} from '../constants';
import {apiSlice} from './apiSlice'; 


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //REGISTER USER
        register: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/register`,
                method: 'POST',
                body: data
            }),
        }),
        //LOGIN
        login : builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: 'POST',
                body: data
            }),
        }),
        //LOGOUT
        logout: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/logout`,
                method: 'POST'
            }),
        }),
        //Profile
        updatepassword: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/updatepassword`,
                method: 'put',
                body: data
            }),
        }),
        //VerifyEmail
        verifyemail: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/verifyemail`,
                method: 'post',
            })
        }),
        //ACCOUNT VERIFICATION
        accountverify: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/accountverify/:veriftoken`,
                method: 'post',
            }),
        }),
        //FORGET PASSWORD
        forgetpassword: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/forgetpassword`,
                method: 'post',
                body: data
            }),
        }),
        //RESET PASSWORD
        resetpassword: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/resetpassword/:resettoken`,
                method: 'put',
                body: data
            })
        }),
        //UPLOAD PHOTO
        profilephoto: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/profilephoto`,
                method: 'put',
                body: data
            }),
        })
    }),
});


export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useUpdatepasswordMutation,
    useVerifyemailMutation,
    useAccountverifyMutation,
    useForgetpasswordMutation,
    useResetpasswordMutation,
    useProfilephotoMutation
} = authApiSlice; 