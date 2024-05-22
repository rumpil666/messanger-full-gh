import { IUser } from "./user.types"

export interface IAuthForm {
  email: string
  nickname: string
  password: string
  lastName: string
  firstName: string
}

export type TLogin = Pick<IAuthForm, 'email' | 'password'>

export interface IAuthResponse {
  data: any
  accessToken: string
  user: IUser
}

