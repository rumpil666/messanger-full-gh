import { IChat, ICreateChat } from '@/types/chat.types';
import { $fetch } from '@/$api/api.fetch'

export const chatService = {
  async getChats(isAuth: boolean) {
    const response = await $fetch.get<IChat[]>(
      '/chat',
      isAuth
    )

    return response;
  },

  async getChat(id: string, isAuth: boolean) {
    const response = await $fetch.get<IChat[]>(
      `/chat/${id}`,
      isAuth
    )

    return response;
  },

  async createChat(data: ICreateChat, isAuth: boolean) {
    const response = await $fetch.post<ICreateChat | string>(
      '/chat',
      data,
      isAuth
    )

    return response;
  },

  async updateChat(chatId: string, data: ICreateChat, isAuth: boolean) {
    const response = await $fetch.put<IChat>(
      `/chat/update/${chatId}`,
      data,
      isAuth
    )

    return response;
  },

  async addNewUserInChat(chatId: string, data: ICreateChat, isAuth: boolean) {
    const response = await $fetch.put<IChat>(
      `/chat/add-user/${chatId}`,
      data,
      isAuth
    )

    return response;
  },

  async removeUserFromChat(chatId: string, data: ICreateChat, isAuth: boolean) {
    const response = await $fetch.delete<ICreateChat>(
      `/chat/remove-user/${chatId}`,
      data,
      isAuth
    )

    return response;
  },

  async removeChat(chatId: string, isAuth: boolean) {
    const response = await $fetch.delete<ICreateChat>(
      `/chat/remove/${chatId}`,
      undefined,
      isAuth
    )

    return response;
  },
}