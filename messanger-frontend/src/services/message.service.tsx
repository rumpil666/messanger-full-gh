import { IMessage, IRemoveMessage, ISendMessage } from '@/types/chat.types';
import { $fetch } from '@/$api/api.fetch'

export const messageService = {
  async sendMessage(chatId: string, message: ISendMessage, isAuth: boolean) {
    const response = await $fetch.post<IMessage>(
      `/chat/message/${chatId}`,
      message,
      isAuth
    )
    return response;
  },

  async removeMessage(chatId: string, messageId: string, isAuth: boolean) {
    const response = await $fetch.delete<IRemoveMessage>(
      `/chat/message/${messageId}`,
      [chatId],
      isAuth
    )
    return response;
  },
}