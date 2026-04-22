import {api} from "./api";

export const authApi = api.injectEndpoints({
    endpoints : (builder) => ({
        login: builder.mutation<
        {tocken : string},
        {email:string, password:string}
        >({
            query : (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            })
        }),

        register : builder.mutation<
        any,
        {email:string, password:string}
        >({
            query : (body) => ({
                url : '/auth/register',
                method : 'POST',
                body,
            })
        })
    }),


})

export const {useLoginMutation, useRegisterMutation} = authApi;