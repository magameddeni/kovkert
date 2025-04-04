import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../baseQuery'
import { IBasketResponse } from '../types'
import { updateBasketData, updateTotalPriceAndQuantity } from './basketSlice'
import { IAddBasketItem } from './models'

const BASKET_ROUTE = '/api/basket'

export const basketApi = createApi({
  reducerPath: 'basket/api',
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    getBasket: build.mutation<IBasketResponse, string | undefined>({
      query: (arg) => ({
        url: `${BASKET_ROUTE}/${arg}`,
        method: 'GET',
        credentials: 'include'
      }),
      async onQueryStarted(arg: any, { dispatch, queryFulfilled }: any) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateBasketData(data.basket.items))
          dispatch(updateTotalPriceAndQuantity(data.basket.items))
        } catch (err) {
          console.error(err)
        }
      }
    }),
    addBasketItem: build.mutation<IBasketResponse, IAddBasketItem[]>({
      query: (items) => {
        const { basketId } = items[0]

        return {
          url: `${BASKET_ROUTE}/${basketId}/items/add`,
          method: 'PATCH',
          body: { items }
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }: any) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateBasketData(data.basket.items))
          dispatch(updateTotalPriceAndQuantity(data.basket.items))
        } catch (err) {
          console.error(err)
        }
      }
    }),
    removeBasketItem: build.mutation<
      IBasketResponse,
      { basketId: string | undefined; items: (string | undefined)[] }[]
    >({
      query: (data) => {
        const { basketId, ...rest } = data[0]

        return {
          url: `${BASKET_ROUTE}/${basketId}/items/delete`,
          method: 'PATCH',
          body: rest
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }: any) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateBasketData(data.basket.items))
          dispatch(updateTotalPriceAndQuantity(data.basket.items))
        } catch (err) {
          console.error(err)
        }
      }
    }),
    selectBasketItem: build.mutation<IBasketResponse, any>({
      query: (data) => {
        const { basketId, ...rest } = data[0]

        return {
          url: `${BASKET_ROUTE}/${basketId}/items/select`,
          method: 'PATCH',
          body: rest
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }: any) {
        try {
          const { data } = await queryFulfilled

          dispatch(updateBasketData(data.basket.items))
          dispatch(updateTotalPriceAndQuantity(data.basket.items))
        } catch (err) {
          console.error(err)
        }
      }
    })
  })
})

export const {
  useGetBasketMutation,
  useAddBasketItemMutation,
  useRemoveBasketItemMutation,
  useSelectBasketItemMutation
} = basketApi
