import { IProductCharacteristics, IProductImages, IProductPackage } from '@/models/product'
import { TShopAddress, TShopSocial } from '@/models/store'

export type TCheckout = {
  _id: string
  user: string
  checkoutItems: TCheckoutItem[]
  __v: number
}

export type TCheckoutItem = {
  address?: TShopAddress
  deliveryPrice?: number
  deliveryType?: string
  items: TCheckoutItemItem[]
  payMethod?: string
  recipient?: string
  shop: TCheckoutShop
  totalPrice: number
  _id: string
}

export type TCheckoutItemItem = {
  product: TCheckoutItemItemProduct
  quantity: number
  price: number
  totalPrice: number
  _id: string
}

export type TCheckoutShop = {
  _id: string
  user: string
  name: string
  phoneNumber: string
  __v: number
  social: TShopSocial[]
  description: string
  image: string
  shopCode: number
  createdAt: Date
  updatedAt: Date
  inn: string
  legalInformation: string
  verified: boolean
  addresses: TShopAddress[]
  deliveryMethods: string[]
  paymentMethods: string[]
  schedule: string
  slug: string
  codeOrg: string
}

export interface TCheckoutItemItemProduct {
  package: IProductPackage
  _id: string
  shop: string
  productName: string
  categories: string[]
  barcode: number
  SKU: string
  characteristics: IProductCharacteristics[]
  description: string
  images: IProductImages[]
  discountPrice: number
  stock: number
  active: boolean
  verified: boolean
  offers: any[]
  createdAt: Date
  updatedAt: Date
  __v: number
  manufacturerSKU: string
  regularPrice?: number
}

export type TUserRecipient = {
  createdAt?: Date
  email?: string
  firstName: string
  lastName?: string
  phone: string
  updatedAt?: Date
  user?: string
  __v?: number
  _id: string
}

export type TUserAddress = {
  _id?: string
  user?: string
  coordinates: number[]
  street?: string
  building?: string
  city?: string
  comment?: string
  fullname?: string
  porch?: string
  sflat?: string
  sfloor?: string
  createdAt?: Date
  updatedAt?: Date
  __v?: number
}
