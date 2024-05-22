export interface IUser {
  id: string
  email: string
  nickname: string
  imageUrl: string
  firstName: string
  lastName: string
}

export type UpdateUser = Partial<Omit<IUser, 'id'>>

export interface IUserInChat extends Omit<IUser, 'id'> {
  chatId: string
  userId: string
}