import { IProductImages } from './product'

export interface IBasketItemProduct {
  discountPrice: number
  images: IProductImages[]
  productName: string
  regularPrice?: number
  shop: {
    _id: string
    name: string
    slug: string
  }
  stock: number
  _id: string
}

export interface IBasketItem extends TAffiliateProperties {
  createdAt?: string
  product: IBasketItemProduct
  quantity: number
  selected: boolean
  updatedAt?: string
  _id?: string
}

export type TAffiliateProperties = {
  affiliateCode?: string
  affiliateDiscount?: number
}
