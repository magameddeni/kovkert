import { deliveryLabelsById } from '@/components/Orders/models/deliveryType'

export type TOrderStatus =
  | 'Ожидает оплаты'
  | 'Оплачено'
  | 'Отменено покупателем'
  | 'Отменено продавцом'
  | 'В сборке'
  | 'Доставлено'

export enum EOrderDeliveryTypeLabel {
  pickup = 'Самовывоз из магазина',
  delivery = 'Доставка курьером'
}

export interface IOrderItem {
  _id: string
  product: {
    _id: string
    productName: string
    images: [
      {
        link: string
        order: number
      }
    ]
    review?: string
  }
  price: number
  quantity: number
  totalPrice: number
}

export interface IOrderGroupOrderItem extends Omit<IOrderItem, 'product'> {
  product: {
    _id: string
    productName: string
    image: string
  }
}

export interface IOrderGroup {
  _id: string
  orderNumber: number
  totalPrice: number
  orders: IOrder[]
  orderItems: IOrderGroupOrderItem[]
  user: string
  createdAt: Date
  updatedAt: Date
  paymentUrl?: string
}

export interface IOrder {
  _id: string
  createdAt: Date
  orderNumber: number
  deliveryAddress: string
  deliveryPrice?: number
  deliveryType: {
    label: EOrderDeliveryTypeLabel
    _id: keyof typeof deliveryLabelsById
  }
  paymentMethod: {
    label: string
    _id: string
  }
  orderItems: IOrderItem[]
  shop: {
    name: string
    address: string
    phoneNumber: string
    email: string | undefined
    coordinates: [number, number]
    schedule: any
    _id: string
  }
  totalPrice: number
  updatedAt: Date
  recipient: {
    email: string | undefined
    lastName: string
    firstName: string
    phone: string
  }
  status?: TOrderStatus
}

export interface IOrderResponse {
  createdAt: Date
  hasReceipt: boolean
  orderNumber: number
  orders: IOrder[]
  totalPrice: number
  user: string
  paymentUrl?: string
  _id: string
}

export interface IOrderGroupResponse {
  orders: IOrderGroup[]
  totalCount: number
}

export interface ICheckoutOrder {
  createdAt: Date
  orderNumber: string
  orders: string[]
  totalPrice: number
  updatedAt: Date
  user: string
  __v: number
  _id: string
}

export interface ICheckoutOrderPay {
  paymentUrl: string
  orderNumber: string
}
