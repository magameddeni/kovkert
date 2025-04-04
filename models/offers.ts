export interface TOfferCategoriesList {
  image: { link: string; key: string }
  categories: { title: string; _id: string }[]
  category: { title: string; _id: string }
  order: number
}

export interface TOffer {
  _id: string
  title?: string
  sub?: string[]
  type?: string
  editable?: boolean
  photo?: string
  isAvailable?: boolean
  order?: number
  isOffer?: boolean
  categoryList: TOfferCategoriesList[]
}
