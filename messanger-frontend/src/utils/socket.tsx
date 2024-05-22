'use client'
import { socket } from "../socket";
import { useEffect } from 'react';
import { IChat, IMessage } from '@/types/chat.types';
import { useUserStore } from "@/stores/useUserStore";
import { useChatStore, addNewMessageInChat } from "@/stores/useChatStore";

const getParticipants = (chatId: string) => {
  const chats = useChatStore.getState().chats;
  const currentUser = useUserStore.getState().user;
  const participants: string[] = chats.find((chat) => chat.id === chatId)
    ?.participants.map((user) => user.nickname)
    .filter((nickname) => nickname !== currentUser.nickname)!

  return participants
}

export const useSocket = () => {
  const [currentUser] = useUserStore(state => [state.user]);
  const setChats = useChatStore.getState().setChats

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      socket.io.engine.on("upgrade", (transport) => {
      });
    }


    function onDisconnect() {
    }

    function updateMessages(message: IMessage) {
      const chats = useChatStore.getState().chats
      addNewMessageInChat(message, chats, (updateChats) => {
        setChats(updateChats)
      })
    }

    function addChats(chat: IChat) {
      const chats = useChatStore.getState().chats
      setChats([...chats, chat])
    }

    function removeChat(chatId: string) {
      const chats = useChatStore.getState().chats
      const newChats = chats.filter((chat) => chat.id !== chatId)
      setChats(newChats)
    }

    function updateChat(chat: IChat) {
      const chats = useChatStore.getState().chats
      const newChats = chats.map((i) => i.id === chat.id ? chat : i)
      setChats(newChats)
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(`add-chats:${currentUser.nickname}`, addChats);
    socket.on(`delete-chat:${currentUser.nickname}`, removeChat);
    socket.on(`update-chat:${currentUser.nickname}`, updateChat);
    socket.on(`add-user-in-chat:${currentUser.nickname}`, updateChat);
    socket.on(`remove-user-from-chat:${currentUser.nickname}`, updateChat);
    socket.on(`update-messages:${currentUser.nickname}`, updateMessages);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(`add-chats:${currentUser.nickname}`, addChats);
      socket.off(`delete-chat:${currentUser.nickname}`, removeChat);
      socket.off(`update-chat:${currentUser.nickname}`, updateChat);
      socket.off(`add-user-in-chat:${currentUser.nickname}`, updateChat);
      socket.off(`remove-user-from-chat:${currentUser.nickname}`, updateChat);
      socket.off(`update-messages:${currentUser.nickname}`, updateMessages);
    };
  }, [currentUser]);

}

export const createChatEvent = (chat: IChat, participants: string[]) => {
  const dataChat = {
    chat: chat,
    participants: participants
  }
  socket.emit('create-chat', dataChat);
}

export const removeChatEvent = (chatId: string) => {
  const dataChat = {
    chatId,
    participants: getParticipants(chatId)
  }
  socket.emit('delete-chat', dataChat);
}

export const updateChatEvent = (chat: IChat) => {
  const dataChat = {
    chat,
    participants: getParticipants(chat.id)
  }
  socket.emit('update-chat', dataChat);
}

export const addUserInChatEvent = (chat: IChat) => {
  const dataChat = {
    chat,
    participants: getParticipants(chat.id)
  }
  socket.emit('add-user-in-chat', dataChat);
}

export const removeUserFromChatEvent = (chat: IChat) => {
  const dataChat = {
    chat,
    participants: getParticipants(chat.id)
  }
  socket.emit('remove-user-from-chat', dataChat);
}

export const sendMessageEvent = (message: IMessage, participants: string[]) => {
  const currentUser = useUserStore.getState().user
  const dataMessage = {
    message: message,
    participants: participants.filter((i) => i !== currentUser.nickname)
  }
  socket.emit('send-message', dataMessage);
}