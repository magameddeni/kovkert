import { createApi } from '@reduxjs/toolkit/query/react'
import { ILoginEmailForm } from '@/models'
import { RegisterInput } from '@/components/Modals/LogInModal/PhoneAuth'
import { clearBasket } from '../basket/basketSlice'
import { clearFavorites } from '../favorite/favoritesSlice'
import { favoritesApi } from '../favorite/favoritesApi'
import { userApi } from '../user/userApi'
import { clearUser } from '../user/userSlice'
import { baseQueryWithReauth } from '../baseQuery'
import { IGenericResponse, IOTPResponse } from '../types'
import { logout, setToken } from './authSlice'

const AUTH_ROUTE = '/api/v1.0'

export const authApi = createApi({
  reducerPath: 'auth/api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    registerUser: builder.mutation<IGenericResponse, RegisterInput>({
      query: (data) => ({
        url: `/api/auth/phone/send`,
        method: 'POST',
        body: data
      })
    }),
    loginUser: builder.mutation<{ accessToken: string; status: string }, ILoginEmailForm>({
      query: (data) => ({
        url: `${AUTH_ROUTE}/login_profile`,
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled
          dispatch(setToken(response.data.accessToken))
          await dispatch(userApi.endpoints.getUser.initiate(null, { forceRefetch: true }))
          // @ts-ignore
          await dispatch(favoritesApi.endpoints.getFavorites.initiate({ type: 'Product' }))
        } catch (error: any) {
          console.error(error, 'login errors')
        }
      }
    }),
    verifyOTP: builder.mutation<{ accessToken: string; status: string }, { otp: string; phoneNumber: string }>({
      query: (data) => ({
        url: `/api/auth/phone/verify`,
        method: 'POST',
        body: data
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled
          dispatch(setToken(response.data.accessToken))
          // @ts-ignore
          await dispatch(userApi.endpoints.getUser.initiate(null, { forceRefetch: true }))
          // @ts-ignore
          await dispatch(favoritesApi.endpoints.getFavorites.initiate({ type: 'Product' }))
        } catch (error: any) {
          console.error(error)
        }
      }
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: `/api/auth/logout`,
        credentials: 'include'
      }),
      async onQueryStarted(args, { dispatch }) {
        try {
          dispatch(logout())
          dispatch(clearUser())
          dispatch(clearBasket())
          dispatch(clearFavorites())
        } catch (error: any) {
          console.error(error)
        }
      }
    }),
    resetPhone: builder.mutation<IOTPResponse, { phoneNumber: string }>({
      query: (phoneNumber) => ({
        url: `${AUTH_ROUTE}/reset_phone`,
        method: 'POST',
        body: phoneNumber
      })
    }),
    confirmResetPhoneOTP: builder.mutation<IOTPResponse, { OTP: string }>({
      query: (data) => ({
        url: `${AUTH_ROUTE}/confirm_reset_phone`,
        method: 'POST',
        body: data
      })
    }),
    changePhone: builder.mutation<IOTPResponse, { newPhoneNumber: string }>({
      query: (data) => ({
        url: `${AUTH_ROUTE}/change_phone`,
        method: 'POST',
        body: data
      })
    }),
    confirmChangePhoneOTP: builder.mutation<IOTPResponse, { OTP: string; phoneNumber: string }>({
      query: (data) => ({
        url: `${AUTH_ROUTE}/verify_new_phone`,
        method: 'POST',
        body: data
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        await queryFulfilled
        // @ts-ignore
        await dispatch(userApi.endpoints.getUser.initiate(null, { forceRefetch: true }))
      }
    })
  })
})

export const {
  useLoginUserMutation,
  useLogoutUserMutation,
  useRegisterUserMutation,
  useVerifyOTPMutation,
  useResetPhoneMutation,
  useConfirmResetPhoneOTPMutation,
  useChangePhoneMutation,
  useConfirmChangePhoneOTPMutation
} = authApi
