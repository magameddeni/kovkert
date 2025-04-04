export interface IMessage {
  _id: string
  conversation: string
  createdAt: Date
  deletedFor: string[]
  message: string
  onModelUser: string
  read: boolean
  thumb: string
  uid: string
  updatedAt: Date
  url: string
  user: string
}

export interface IDialog {
  _id: string
  companion: {
    _id: string
    image: string
    name: string
    role: string
  }
  counter: number
  lastMessage: string
  messages: IMessage[]
}
