import { IBasketItem, IProduct, IStore } from '@/models'

export interface IBasketResponse {
  basket: {
    createdAt: Date
    items: IBasketItem[]
    updatedAt: Date
    user: string
    __v: number
    _id: string
  }
  message?: string
}

export interface IGenericResponse {
  status: string
  message: string
  user: { id: string }
  data: any
}

export interface IFavoritesResponse {
  data: IProduct[] | IStore[]
  message: string
}

export interface IFavoritesItem {
  productId: string
}

export interface IOTPResponse {
  resend: number
  message: string
  resendAfter: number
  status: string
  user: object
}
