export interface IAddBasketItem {
  basketId?: string
  product: {
    _id: string
    shop: {
      _id: string
    }
  }
  quantity: number
  price: number
}
