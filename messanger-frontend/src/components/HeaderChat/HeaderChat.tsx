import styles from "./HeaderChat.module.scss";
import { Avatar, Tooltip } from "antd";
import { DropDownChat } from "../DropDownChat/DropDownChat";
import { useUserStore } from "@/stores/useUserStore";
import { useChatStore } from "@/stores/useChatStore";

interface IHeaderChatProps {
  chatId: string
}

export const HeaderChat: React.FC<IHeaderChatProps> = ({ chatId }) => {
  const [currentUser] = useUserStore(state => [state.user]);
  const [chats] = useChatStore(state => [state.chats]);

  const chat = chats.find((i) => i.id === chatId);
  const correspondent = chat?.participants.find((user) => user.email !== currentUser.email)
  const participants = chat?.participants.filter((user) => user.email !== currentUser.email)
  const isAdmin = currentUser.id === chat?.admin;

  return (
    <header className={styles.header}>
      <div className={styles.header__participants}>
        <Avatar.Group maxCount={4} maxStyle={{ color: '#4a00f5', backgroundColor: '#d0cffd' }}>
          {participants?.map((user) => (
            <Tooltip key={user.nickname} title={`${user.lastName} ${user.firstName}`} placement="bottom">
              <Avatar src={user.imageUrl} />
            </Tooltip>))}
        </Avatar.Group>
      </div>
      <div className={styles.header__container}>
        <h1 className={styles.header__title}>{chat?.isGroup ? chat.name : `${correspondent?.lastName} ${correspondent?.firstName}`}</h1>
        <h2 className={styles.header__subtitle}>last seen 45 minutes ago</h2>
      </div>
      <DropDownChat isGroup={chat?.isGroup!} isAdmin={isAdmin} chatId={chatId} />
    </header>
  )
};