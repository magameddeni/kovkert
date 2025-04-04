import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IBasketItem } from '@/models'

export interface IBasketState {
  data: IBasketItem[]
  totalPrice: number
  totalPriceBeforeDiscount: number
  quantity: number
}

const initialState: IBasketState = {
  data: [],
  totalPrice: 0,
  totalPriceBeforeDiscount: 0,
  quantity: 0
}

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    updateTotalPriceAndQuantity: (state: IBasketState, action: PayloadAction<IBasketItem[]>) => ({
      ...state,
      totalPrice: action.payload.reduce((acc: number, v: IBasketItem) => {
        const affDiscount = v.affiliateDiscount ?? 0
        const currentPrice = v.product.discountPrice
        const price = affDiscount ? currentPrice * (1 - affDiscount / 100) : currentPrice

        return acc + (v.selected && v.product.stock > 0 ? price * v.quantity : 0)
      }, 0),
      totalPriceBeforeDiscount: action.payload.reduce((acc: number, v: IBasketItem) => {
        const price = v.product?.regularPrice || v.product.discountPrice
        return acc + (v.selected && v.product.stock > 0 ? price * v.quantity : 0)
      }, 0),
      quantity: action.payload.reduce((acc: number, v: IBasketItem) => acc + (v.product.stock > 0 ? v.quantity : 0), 0)
    }),
    updateBasketData: (state: IBasketState, action: PayloadAction<IBasketItem[]>) => ({
      ...state,
      data: action.payload
    }),
    addBasketItemsLocal: (state: IBasketState, action: PayloadAction<IBasketItem[]>) => {
      const items: IBasketItem[] = action.payload

      items.forEach((v: IBasketItem) => {
        const foundItemInBasket: IBasketItem | undefined = state.data.find(
          (prevItems: IBasketItem) => prevItems.product._id === v.product._id
        )

        if (foundItemInBasket) {
          const pricePrev = foundItemInBasket.product?.regularPrice || foundItemInBasket.product.discountPrice
          const priceCurrent = v.product?.regularPrice || v.product.discountPrice

          state.quantity = state.quantity - foundItemInBasket.quantity + v.quantity
          state.totalPrice =
            state.totalPrice -
            foundItemInBasket.product.discountPrice * foundItemInBasket.quantity +
            v.product.discountPrice * v.quantity
          state.totalPriceBeforeDiscount =
            state.totalPriceBeforeDiscount - pricePrev * foundItemInBasket.quantity + priceCurrent * v.quantity
          foundItemInBasket.quantity = v.quantity
        } else {
          state.quantity += v.quantity
          state.totalPrice += v.product.discountPrice * v.quantity
          state.totalPriceBeforeDiscount += (v.product?.regularPrice || v.product.discountPrice) * v.quantity
          state.data.push(v)
        }
      })
    },
    removeBasketItemsLocal: (state: IBasketState, action: PayloadAction<(string | undefined)[]>) => ({
      ...state,
      data: state.data.filter((v: IBasketItem) => !action.payload.includes(v.product._id)),
      totalPrice:
        state.totalPrice -
        state.data.reduce(
          (acc: number, v: IBasketItem) =>
            action.payload.includes(v.product._id) ? v.product.discountPrice * v.quantity + acc : acc,
          0
        ),
      totalPriceBeforeDiscount:
        state.totalPriceBeforeDiscount -
        state.data.reduce(
          (acc: number, v: IBasketItem) =>
            action.payload.includes(v.product._id)
              ? (v.product?.regularPrice || v.product.discountPrice) * v.quantity + acc
              : acc,
          0
        ),
      quantity:
        state.quantity -
        state.data.reduce(
          (acc: number, v: IBasketItem) => (action.payload.includes(v.product._id) ? v.quantity + acc : acc),
          0
        )
    }),
    selectBasketItemsLocal: (state: IBasketState, action: PayloadAction<{ items: string[]; value: boolean }>) => ({
      ...state,
      data: state.data.map((v: IBasketItem) => {
        if (action.payload.items.includes(v.product._id)) {
          return { ...v, selected: action.payload.value }
        }

        return v
      })
    }),
    clearBasket: () => initialState
  }
})

export const {
  updateTotalPriceAndQuantity,
  updateBasketData,
  addBasketItemsLocal,
  removeBasketItemsLocal,
  selectBasketItemsLocal,
  clearBasket
} = basketSlice.actions

export default basketSlice.reducer
