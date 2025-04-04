export interface IUser {
  email: string
  phoneNumber: string
  name: string
  image: string
  emailConfirmed: boolean
  uuid: number
  sex: string
  patronymic: string
  lastName: string
  addresses: any[]
  searchHistory: string[]
  id: string
  roles: string[]
  basketId: string
  _id: string
  notificationData: PushSubscription
  firebaseToken: string
}
