export type TBanner = {
  _id?: string
  smallImage: {
    link: string
    key: string
  }
  mediumImage: {
    link: string
    key: string
  }
  largeImage: {
    link: string
    key: string
  }
  isAds: boolean
  client: string
  createdAt: Date
  updateAt: Date
  active: boolean
  text: string
  link: string
}
