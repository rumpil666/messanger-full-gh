'use client'

import styles from "./ChatList.module.scss";
import { ChatListItem } from "../ChatListItem/ChatListItem";
import { UserListItem } from "../UserListItem/UserListItem";
import { useEffect, useState } from "react";
import Field from "../UI/Field/Field";
import useDebounce from "@/hooks/UseDebounce";
import { useSocket } from "@/utils/socket";
import { useChatStore } from "@/stores/useChatStore";
import { useUserStore } from "@/stores/useUserStore";

export const ChatList: React.FC = () => {
  useSocket()
  const [isSearchTerm, setIsSearchTerm] = useState('');

  const [chats] = useChatStore(state => [state.chats]);

  const [
    foundUsers,
    searchUser,
  ] = useUserStore(state => [
    state.foundUsers,
    state.searchUser,
  ]);

  const debouncedSearch = useDebounce(isSearchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      searchUser(isSearchTerm)
    }
  }, [debouncedSearch])

  return (
    <div className={styles.chatList}>
      <div className={styles.chatList__field}>
        <Field
          placeholder='Search chat...'
          value={isSearchTerm}
          onChange={(e: any) => setIsSearchTerm(e.target.value)}
        />
      </div>
      <ul className={styles.chatList__list}>
        {
          (isSearchTerm.length !== 0 && foundUsers?.length !== 0)
            ? foundUsers?.map((user) => (
              <UserListItem
                key={user.id}
                {...user}
                setIsSearchTerm={setIsSearchTerm}
              />
            ))
            : (isSearchTerm.length !== 0 && foundUsers?.length === 0)
              ? <p className={styles.chatList__title}>Пользователь не найден</p>
              : (chats?.length !== 0)
                ? chats.map((chat) =>
                ((chat.messages?.length > 0 || chat.isGroup) && (<ChatListItem
                  key={chat.id}
                  {...chat}
                />)))
                : <p className={styles.chatList__title}>У вас пока нет активных диалогов</p>
        }
      </ul>
    </div>
  )
}