import { IProductImages } from '@/models/product'

export interface ProductAffiliate {
  _id: string
  discountPercentage: number
  endDate: Date
  createdAt: Date
  name: string
  shop: {
    _id: string
    name: string
  }
  image: IProductImages
  index: number
  price: number
  productId: string
}
