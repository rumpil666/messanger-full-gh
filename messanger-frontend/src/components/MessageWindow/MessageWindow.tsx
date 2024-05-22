import { useEffect, useRef, useState } from 'react'
import styles from "./MessageWindow.module.scss";
import { MessageBubble } from "../MessageBubble/MessageBubble";
import dayjs from "dayjs";
import { useChatStore } from '@/stores/useChatStore';
import { IMessage } from '@/types/chat.types';

interface IMessageWindowProps {
  chatId: string
}

export const MessageWindow: React.FC<IMessageWindowProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<IMessage[]>([])
  const [chats] = useChatStore(state => [state.chats]);
  const container = useRef<HTMLDivElement>(null);

  const scroll = () => {
    const { scrollHeight } = container.current as HTMLDivElement;
    container.current?.scrollTo({
      top: scrollHeight,
      left: 0,
      behavior: 'smooth',
    })
  };

  useEffect(() => {
    setMessages(chats.find((i) => i.id === chatId)?.messages!)
  }, [chats])

  useEffect(() => {
    scroll()
  }, [messages])

  return (
    <div className={styles.messageWindow} ref={container}>
      <p className={styles.messageWindow__time}>{dayjs().format('D/MM/YYYY')}</p>
      <ul id="container" className={styles.messageWindow__container}>
        {messages?.map((message) => (
          <MessageBubble
            key={message.id}
            userId={message.sender}
            chatId={message.chatId}
            id={message.id}
            title={message.messageBody}
            dataImg={message.fileList}
            createdAt={message.createdAt}
            messages={messages}
          />
        ))}
      </ul>
    </div>
  )
};