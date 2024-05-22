import Link from "next/link";
import styles from "./ChatListItem.module.scss";
import { IChat } from "@/types/chat.types";
import { Avatar } from "antd";
import { useUserStore } from "@/stores/useUserStore";

interface IChatProps extends IChat { };

export const ChatListItem: React.FC<IChatProps> = ({ id, name, isGroup, participants, messages, imageUrl }) => {
  const [currentUser] = useUserStore(state => [state.user]);

  const correspondent = participants.find((user) => user.email !== currentUser.email)
  const lastMessage = messages?.at(-1);
  return (
    <Link
      href={`/chat/${id}`}
      className={styles.chatItem}
    >
      <Avatar
        src={isGroup ? imageUrl : `${correspondent?.imageUrl}`}
        alt={name}
        size={50}
      />
      <div>
        <h2 className={styles.chatItem__title}>{isGroup ? name : `${correspondent?.firstName} ${correspondent?.lastName}`}</h2>
        <h3 className={styles.chatItem__subtitle}>{lastMessage?.messageBody}</h3>
      </div>
    </Link>
  )
}