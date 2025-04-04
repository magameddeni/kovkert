import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IProduct, IStore } from '@/models'

export interface IFavoritesState {
  products: IProduct[]
  shops: IStore[]
}

const initialState: IFavoritesState = {
  products: [],
  shops: []
}

export const favoritesSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    addProduct: (state: IFavoritesState, action: PayloadAction<IProduct>) => {
      state.products?.push(action.payload)
    },
    updateStock: (state: IFavoritesState, action: PayloadAction<IProduct>) => {
      const product = state.products.find(({ _id }) => _id === action.payload._id)
      if (product) product.stock = action.payload.stock
    },
    deleteProduct: (state: IFavoritesState, action: PayloadAction<IProduct>) => {
      state.products = state.products?.filter((item: IProduct) => item._id !== action.payload._id)
    },
    addShop: (state: IFavoritesState, action: PayloadAction<IStore>) => {
      state.shops?.push(action.payload)
    },
    deleteShop: (state: IFavoritesState, action: PayloadAction<IStore>) => {
      state.shops = state.shops?.filter((item: IStore) => item._id !== action.payload._id)
    },
    clearFavorites: () => initialState
  }
})

export const { addShop, addProduct, updateStock, clearFavorites, deleteShop, deleteProduct } = favoritesSlice.actions

export default favoritesSlice.reducer
