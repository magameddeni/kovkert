import { TShopSocial } from '@/models/store'
import { TCategory } from './category'

export interface IProductImages {
  filename: string
  link: string
  order: number
  _id: string
}

export interface IProductPackage {
  weight: number
  length: number
  width: number
  height: number
}

export interface IProductCharacteristicsCharacteristic {
  category: string
  key: string
  measurementUnit: null
  required: boolean
  title: string
  type: string
  value: string[]
  __v: number
  _id: string
}

export interface IProductCharacteristics {
  characteristic: IProductCharacteristicsCharacteristic
  title: string
  value: string[]
  _id: string
}

export type TProductShop = {
  _id: string
  image: string
  name: string
  slug: string
}

export interface IProductShopFull extends TProductShop {
  addresses: string
  createdAt: string
  deliveryMethods: string[]
  description: string
  inn: string
  legalInformation: string
  paymentMethods: string[]
  phoneNumber: string
  schedule: string
  shopCode: number
  social: TShopSocial[]
  updatedAt: string
  user: string
  verified: boolean
  __v: number
}

export interface IProduct {
  SKU: string
  active: boolean
  barcode: number
  categories: TCategory[]
  characteristics: IProductCharacteristics[]
  createdAt: Date
  description: string
  discountPrice: number
  images: IProductImages[]
  package: IProductPackage
  location: {
    coordinates: Array<number>
    type: string
  }
  manufacturerSKU: string
  moderation: string
  offers: Array<string>
  productName: string
  regularPrice: number
  search: string
  seo: string
  shop: TProductShop | IProductShopFull
  stock: number
  rating?: number
  verified: boolean
  _id: string
  vat?: string | number
}
