'use client'
import styles from "./UserListItem.module.scss";
import Link from "next/link";
import { IUser } from "@/types/user.types"
import { ICreateChat } from "@/types/chat.types";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { createChatEvent } from "@/utils/socket";
import { Avatar } from "antd";
import { useChatStore } from "@/stores/useChatStore";

interface IPops extends IUser {
  setIsSearchTerm: Dispatch<SetStateAction<string>>
}

export const UserListItem: React.FC<IPops> = ({ firstName, lastName, imageUrl, nickname, setIsSearchTerm }) => {
  const [chats, setChats, createChat] = useChatStore(state => [state.chats, state.setChats, state.createChat]);

  const { push } = useRouter();

  const handleUser = (data: ICreateChat) => {
    createChat(data, (res) => {
      if (Object.keys(res).length > 1) {
        createChatEvent(res, data.participants);
        setChats([...chats, res])
      }
      push(`/chat/${res.id}`)
    })
  };

  return (
    <Link
      onClick={() => {
        handleUser({ name: '', isGroup: false, imageUrl: '', participants: [nickname!] })
        setIsSearchTerm('')
      }}
      href={`#`}
      className={styles.userItem}
    >
      <Avatar
        src={imageUrl}
        alt={`${firstName} ${lastName}`}
        size={50}
      />
      <div>
        <h2 className={styles.userItem__title}>{`${firstName} ${lastName}`}</h2>
      </div>
    </Link>
  )
}