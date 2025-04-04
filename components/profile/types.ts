export enum ProfileTabValues {
  CHAT = 'chat',
  ORDERS = 'orders',
  INFO = 'info',
  REVIEWS = 'reviews',
  FAVORITE = 'favorite',
  PARTNER = 'partner'
}

export type TRestErrorType = {
  response: {
    data: {
      message: string
      error: string
      success: boolean
    }
  }
}
