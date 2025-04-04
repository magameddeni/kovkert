export enum EStoreDeliveryMethodType {
  SELF_DELIVERY = 'self-delivery',
  COURIER = 'courier'
}

export type TStorePaymentMethodText = 'Спб' | 'При получении' | 'Картой онлайн'

export type TShopAddress = {
  building: string
  building_name: string
  city: string
  comment: string
  coordinates: number[]
  country: string
  createdAt: Date
  fullname: string
  street: string
  updatedAt: Date
  __v: number
  _id: string
}

export type TShopSocial = {
  _id: string
  image: string
  link: string
}

export interface IStoreDeliveryMethod {
  createdAt: Date
  name: string
  text: EStoreDeliveryMethodType
  updatedAt: Date
  __v: number
  _id: string
}

export interface IStorePaymentMethod {
  active: boolean
  image: string
  text: TStorePaymentMethodText
  _id: string
}

export interface IStore {
  addresses: TShopAddress[]
  allSoldItemsCount: number
  deliveryMethods: IStoreDeliveryMethod[]
  phoneNumber: string
  image: string
  inn: string[]
  name: string
  fullName: string
  rating: number
  email: string
  ogrn: string
  slug: string
  createdAt: string
  paymentMethods: IStorePaymentMethod[]
  _id: string
}

export interface IStoreCategory {
  name: string
  sub: IStoreCategory[] | []
  __v: number
}
