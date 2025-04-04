import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ProductSliceType = {
  watchedProducts: string[]
}

const initialState: ProductSliceType = {
  watchedProducts: []
}

export const productSlise = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProductWatched: (state: ProductSliceType, action: PayloadAction<string>) => {
      const { watchedProducts } = state
      const watched = new Set(watchedProducts)
      if (watched.size > 50) watched.delete(watchedProducts[0])
      watched.add(action.payload)
      return {
        ...state,
        watchedProducts: [...watched.values()]
      }
    }
  }
})

export const { addProductWatched } = productSlise.actions

export default productSlise.reducer
