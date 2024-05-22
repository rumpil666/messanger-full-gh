'use client'
import styles from "./Chat.module.scss";
import { HeaderChat } from "@/components/HeaderChat/HeaderChat";
import { MessageWindow } from "@/components/MessageWindow/MessageWindow";
import { NewMessage } from "@/components/NewMessage/NewMessage";

interface IChatProps {
  id: string
}

export const Chat: React.FC<IChatProps> = ({ id }) => {

  return (
    <div className={styles.chat}>
      <HeaderChat chatId={id} />
      <MessageWindow chatId={id} />
      <NewMessage chatId={id} />
    </div>
  );
}
