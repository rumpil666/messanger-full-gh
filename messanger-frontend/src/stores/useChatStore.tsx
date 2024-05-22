import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware'
import { useAuthStore } from './useAuthStore';
import { IChat, ICreateChat, IMessage, ISendMessage } from '@/types/chat.types';
import { chatService } from '@/services/chat.service';
import { useUserStore } from './useUserStore';
import { useUtilsStore } from './useUtilsStore';
import { messageService } from '@/services/message.service';

interface ChatStore {
  chats: IChat[]
  setChats: (chats: IChat[]) => void
  createChat: (date: ICreateChat, callback: (date: IChat) => void) => Promise<void>
  updateChat: (chatId: string, data: ICreateChat, callback: (date: IChat) => void) => Promise<void>
  removeChat: (chatId: string, callback: (date: IChat) => void) => Promise<void>
  addNewUserInChat: (chatId: string, data: ICreateChat, callback: (date: IChat) => void) => Promise<void>
  removeUserFromChat: (chatId: string, data: ICreateChat, callback: (date: IChat) => void) => Promise<void>
  getChats: () => Promise<void>
  sendMessage: (chatId: string, message: ISendMessage, calback?: (message: IMessage, participants: string[]) => void) => Promise<void>
  addNewMessageInChat: (message: IMessage) => void
  removeMessage: (chatId: string, messageId: string) => Promise<void>
};

const user = useUserStore.getState().user;
const isAuth = useAuthStore.getState().isAuth;
const setLoading = useUtilsStore.getState().setLoading;

const sortChatsByTime = (chats: IChat[]) => {
  return [...chats].sort(({ updatedAt: a }, { updatedAt: b }) => (new Date(b) as any) - (new Date(a) as any))
}

const updateUserListInChat = (chats: IChat[], chat: IChat): IChat[] => {
  const chatsArr = chats.map((i) => ({
    ...i,
    participants: i.id === chat.id ? [...chat.participants] : i.participants,
  }))

  return sortChatsByTime(chatsArr)
}

export const addNewMessageInChat = (message: IMessage, chats: IChat[], callback: (updateChats: IChat[]) => void) => {
  const updateChats = chats.map((chat) => ({
    ...chat,
    updatedAt: chat.id === message.chatId ? new Date().toISOString() : chat.updatedAt,
    messages: chat.id === message.chatId ? [...chat.messages, message] : chat.messages,
  }))
  callback(sortChatsByTime(updateChats))
};

export const removeMessage = (chats: IChat[], chatId: string, messageId: string, callback: (updateChats: IChat[]) => void) => {
  const updateChats = chats.map((chat) => ({
    ...chat,
    messages: chat.id === chatId ? chat.messages.filter((message) => message.id !== messageId) : chat.messages,
  }))
  callback(updateChats)
};

export const useChatStore = create<ChatStore>()(persist((set, get) => ({
  chats: [],

  setChats: (chats: IChat[]) => {
    set({
      chats: chats
    })
  },

  createChat: async (data: ICreateChat, callback: (date: IChat) => void) => {
    setLoading(true)
    await chatService
      .createChat(data, isAuth)
      .then((res: any) => {
        callback(res)
      })
      .catch((err: string) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setLoading(false))
  },

  updateChat: async (chatId: string, data: ICreateChat, callback: (date: IChat) => void) => {
    setLoading(true)
    await chatService
      .updateChat(chatId, data, isAuth)
      .then((res) => {
        callback(res)
      })
      .catch((err: string) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setLoading(false))
  },

  removeChat: async (chatId: string, callback: (date: IChat) => void) => {
    setLoading(true)
    const { chats } = get();
    await chatService
      .removeChat(chatId, isAuth)
      .then((res: any) => {
        callback(res)
        set({
          chats: chats.filter((chat) => chat.id !== res.id)
        })
      })
      .catch((err: string) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setLoading(false))
  },

  addNewUserInChat: async (chatId: string, data: ICreateChat, callback: (date: IChat) => void) => {
    setLoading(true)
    const { chats } = get();
    await chatService
      .addNewUserInChat(chatId, data, isAuth)
      .then((res: any) => {
        set({
          chats: updateUserListInChat(chats, res)
        })
        callback(res)
      })
      .catch((err: string) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setLoading(false))
  },

  removeUserFromChat: async (chatId: string, data: ICreateChat, callback: (date: IChat) => void) => {
    setLoading(true)
    const { chats } = get();
    await chatService
      .removeUserFromChat(chatId, data, isAuth)
      .then((res: any) => {
        if (user.nickname === data.participants[0]) {
          set({
            chats: chats.filter((chat) => chat.id !== res.id)
          })
        } else {
          set({
            chats: updateUserListInChat(chats, res)
          })
          callback(res)
        }
      })
      .catch((err: string) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setLoading(false))
  },

  getChats: async () => {
    setLoading(true)
    await chatService
      .getChats(true)
      .then((res) => {
        const sortChat = sortChatsByTime(res);
        set({
          chats: sortChat
        })
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setLoading(false))
  },

  sendMessage: async (chatId: string, message: ISendMessage, calback?: (message: IMessage, participants: string[]) => void) => {
    const { chats } = get()
    setLoading(true)
    const participants = chats
      .find((chat) => chat.id === chatId)?.participants
      .filter((participant) => participant.nickname !== user.nickname)
      .map((participant) => participant.nickname)
    await messageService
      .sendMessage(chatId, message, isAuth)
      .then((res) => {
        if (calback) calback(res, participants!)
        addNewMessageInChat(res, chats, (updateChat) => {
          set({
            chats: updateChat
          })
        })
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setLoading(false))
  },

  addNewMessageInChat: (message) => {
    const { chats } = get()

    const updateChats = chats.map((chat) => ({
      ...chat,
      updatedAt: chat.id === message.chatId ? new Date().toISOString() : chat.updatedAt,
      messages: chat.id === message.chatId ? [...chat.messages, message] : chat.messages,
    }))

    set({
      chats: sortChatsByTime(updateChats)
    })
  },

  removeMessage: async (chatId: string, messageId: string) => {
    setLoading(true)
    const { chats } = get()
    await messageService
      .removeMessage(chatId, messageId, isAuth)
      .then((res) => {
        removeMessage(chats, res.chatId, res.id, (updateChat) => {
          set({
            chats: updateChat
          })
        })
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setLoading(false))
  }
}),
  {
    name: 'chat-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ ...state }),
  },
));