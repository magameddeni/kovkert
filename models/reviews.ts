export interface IReviewBase {
  _id: string
  value: number
  createdAt: Date
  deficiencies?: string
  advantages?: string
  comment?: string
  images: string[]
}

export interface IReviewShop {
  image: string
  name: string
  _id: string
}

export interface IReviewReply {
  createdAt: Date
  text: string
  _id: string
  updatedAt: Date
  likeCount: number | null
  dislikeCount: number | null
  like?: boolean
  dislike?: boolean
}

export interface IReviewCard extends IReviewBase {
  reviewer: string
  productCard: string
  anonym: boolean
  likes: unknown[]
  dislikes: unknown[]
  updatedAt: Date
  __v: number
}

export interface IReview extends IReviewBase {
  _id: string
  productCard: {
    _id: string
    productName: string
    images: {
      link: string
    }[]
  }[]
  reviewer: {
    lastName: string | null
    name: string | null
  }
  likeCount: number | null
  dislikeCount: number | null
  like?: boolean
  dislike?: boolean
  shop: IReviewShop[]
  reply: IReviewReply
}

export type IReviewForm = Pick<IReviewCard, 'value' | 'deficiencies' | 'advantages' | 'comment' | 'anonym' | 'images'>
