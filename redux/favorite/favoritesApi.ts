import { createApi } from '@reduxjs/toolkit/query/react'
import { IProduct, IStore } from '@/models'
import { AppState } from '@/redux/store'
import { baseQueryWithReauth } from '../baseQuery'
import { IFavoritesItem, IFavoritesResponse } from '../types'
import { addProduct, addShop, deleteProduct, deleteShop } from './favoritesSlice'

const FAVORITES_API = '/api/favorites'

type FavoriteType = 'Product' | 'Shop'
const isProductType = (type: FavoriteType) => type === 'Product'

export const favoritesApi = createApi({
  reducerPath: 'favoritesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Favorites'],
  endpoints: (builder) => ({
    initFavorites: builder.mutation<IFavoritesResponse, { items: IFavoritesItem[] }>({
      query(data) {
        return {
          url: `${FAVORITES_API}/add_to_favorites`,
          method: 'POST',
          body: data
        }
      }
    }),
    addToFavorites: builder.mutation<IFavoritesResponse, { item: IProduct | IStore; type: FavoriteType }>({
      query({ item, type }) {
        return {
          url: `${FAVORITES_API}/add_to_favorites`,
          method: 'POST',
          body: {
            type,
            item: item._id
          }
        }
      },
      onQueryStarted({ item, type }, { dispatch }: any) {
        if (type === 'Product') {
          dispatch(addProduct(item as IProduct))
        } else {
          dispatch(addShop(item as IStore))
        }
      }
    }),
    deleteFromFavorites: builder.mutation<IFavoritesResponse, { item: IProduct | IStore; type: FavoriteType }>({
      query(data) {
        return {
          url: `${FAVORITES_API}/${data.item?._id}`,
          method: 'DELETE',
          body: data
        }
      },
      onQueryStarted({ item, type }, { dispatch }: any) {
        if (type === 'Product') {
          dispatch(deleteProduct(item as IProduct))
        } else {
          dispatch(deleteShop(item as IStore))
        }
      }
    }),
    getFavorites: builder.mutation<IFavoritesResponse, { type?: FavoriteType }>({
      query({ type }) {
        return {
          url: `${FAVORITES_API}/getfavorites?type=${type}`,
          method: 'GET'
        }
      },
      async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
        const { data } = await queryFulfilled
        const store = getState() as unknown as AppState
        const storeItems = store.beru.favorite
        const serverItems = data?.data

        const isProduct = isProductType(args.type as FavoriteType)

        const items = isProduct ? 'products' : 'shops'
        const dispatchHandler = isProduct ? addProduct : addShop

        const ids: { [key: string]: IProduct | IStore } = {}

        storeItems[items]?.forEach((item) => {
          ids[item?._id] = item
        })

        if (serverItems?.length) {
          serverItems?.forEach((item) => {
            if (!ids[item._id]) {
              dispatch(dispatchHandler(item as any))
            }
          })
        }
      }
    })
  })
})

export const { useGetFavoritesMutation, useAddToFavoritesMutation, useDeleteFromFavoritesMutation } = favoritesApi
