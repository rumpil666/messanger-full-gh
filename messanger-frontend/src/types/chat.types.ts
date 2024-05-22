import { IUserInChat } from "./user.types"

export interface IMessage {
  id: string
  createdAt: string
  updateAt: string
  sender: string
  messageBody: string
  fileList: string[]
  chatId: string
}

export type ISendMessage = Partial<Pick<IMessage, 'messageBody' | 'fileList'>>

export type IRemoveMessage = Pick<IMessage, 'chatId' | 'id'>

export interface IChat {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  isGroup: boolean
  imageUrl: string
  admin: string
  participants: IUserInChat[]
  messages: IMessage[]
}

export interface ICreateChat {
  name?: string,
  isGroup?: boolean,
  imageUrl?: string,
  participants: string[],
  admin?: string
}