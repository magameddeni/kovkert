import { createApi } from '@reduxjs/toolkit/query/react'
import { IBasketItem, IUser } from '@/models'
import { IPersonalInfoInput } from '@/components/Interface/modals'
import { AppState } from '../store'
import { basketApi } from '../basket/basketApi'
import { baseQueryWithReauth } from '../baseQuery'
import { IOTPResponse } from '../types'
import { setUser } from './userSlice'

const USER_ROUTES = '/api/v1.0/users'

export const userApi = createApi({
  reducerPath: 'user/api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query<IUser, { initial?: boolean } | null>({
      query: () => ({
        url: `${USER_ROUTES}/me`,
        method: 'GET',
        credentials: 'include'
      }),
      transformResponse: (result: { data: { user: IUser } }) => result.data.user,
      async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled

          if (!args) {
            const store = getState() as unknown as AppState
            const basketItems: IBasketItem[] = store.beru.basket.data

            if (basketItems?.length) {
              const newUserBasketItems = basketItems.map((v: IBasketItem) => ({
                basketId: data?.basketId,
                product: { _id: v.product._id, shop: { _id: v.product.shop._id } },
                quantity: v.quantity,
                price: v.product.discountPrice
              }))

              dispatch(basketApi.endpoints.addBasketItem.initiate(newUserBasketItems))
            }

            dispatch(basketApi.endpoints.getBasket.initiate(data?.basketId))
          }

          dispatch(setUser(data))
        } catch (error: any) {
          console.error(error)
        }
      },
      providesTags: ['User']
    }),
    updateEmail: builder.mutation<IOTPResponse, { email: string; phoneNumber: string }>({
      query: (data) => ({
        url: `${USER_ROUTES}/me/email/`,
        method: 'PUT',
        body: data
      })
    }),
    confirmEmailUpdate: builder.mutation<IOTPResponse, { email: string; phoneNumber: string; otp: string }>({
      query: (data) => ({
        url: `${USER_ROUTES}/me/email/send`,
        method: 'POST',
        body: data
      })
    }),
    verifyEmail: builder.mutation<IOTPResponse, { email: string; otp: string }>({
      query: (data) => ({
        url: `${USER_ROUTES}/me/email/verify`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // @ts-ignore
          await dispatch(userApi.endpoints.getUser.initiate(null))
        } catch (error: any) {
          console.error(error)
        }
      }
    }),
    updateUserInfo: builder.mutation<any, IPersonalInfoInput>({
      query: (data) => ({
        url: `${USER_ROUTES}/me/personal-data`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // @ts-ignore
          await dispatch(userApi.endpoints.getUser.initiate(null))
        } catch (error: any) {
          console.error(error)
        }
      }
    })
  })
})

export const {
  useLazyGetUserQuery,
  useUpdateEmailMutation,
  useConfirmEmailUpdateMutation,
  useVerifyEmailMutation,
  useUpdateUserInfoMutation
} = userApi
