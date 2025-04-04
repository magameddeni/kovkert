import { IProductImages } from '@/models'

export type AffiliateLinks = {
  _id: string
  createdAt: Date
  programId: string
  discountPercentage: number
  endDate: Date
  name: string
  image: IProductImages
  index: number
}
