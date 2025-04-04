export interface IMessage {
  conversation: string
  deletedFor?: Array<any>
  message: string
  onModelUser: string
  read: boolean
  thumb: string
  uid: string
  url: string
  user: any
  pending?: boolean
  createdAt: Date
  updatedAt: Date
  _id: string
}

export interface IChat {
  companion: {
    slug: string
    image?: string
    name: string
    role: string
    _id: string
  }
  counter: number
  lastMessage?: string
  messages: IMessage[]
  participants: [
    {
      image: string
      name: string
      role: string
      _id: string
    }
  ]
  type?: string
  _id: string
}
