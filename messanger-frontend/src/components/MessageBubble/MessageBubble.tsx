import styles from "./MessageBubble.module.scss";
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from "dayjs";
import { Avatar, Button, Space, message } from "antd";
import { ImgContainer } from "../ImgContainer/ImgContainer";
import { IChat, IMessage } from "@/types/chat.types";
import { useUserStore } from "@/stores/useUserStore";
import { useChatStore } from "@/stores/useChatStore";

interface MessageBubbleProps {
  userId: string
  id: string
  title: string
  createdAt: string
  dataImg?: string[]
  chatId: string
  messages: IMessage[]
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ userId, id, title, createdAt, dataImg, chatId, messages }) => {
  const [currentUser] = useUserStore(state => [state.user]);
  const [chats, removeMessage] = useChatStore(state => [state.chats, state.removeMessage]);

  const isSender = (id: string): boolean => {
    if (id === currentUser.id) return true;
    return false;
  }

  const getChat = (chatId: string) => {
    return chats.find((chat) => chat.id === chatId)
  }

  const getSender = (userId: string, chat: IChat) => {
    return chat?.participants.find((user) => user.userId === userId)
  }

  const chat = getChat(chatId)
  const sender = getSender(userId, chat!)

  const checkSenderLastMessage = (id: string, arr: IMessage[]) => {
    const index: number = arr.findIndex((i: IMessage) => i.id === id);
    if (arr[index]?.sender !== arr[index - 1]?.sender) return false;
    return true;
  };

  const getBuble = (id: string, arr: IMessage[]) => {
    if (checkSenderLastMessage(id, arr) && isSender(userId)) {
      return styles.messageBubble__container_right;
    } else if (checkSenderLastMessage(id, arr) && !isSender(userId) && chat?.isGroup) {
      return styles.messageBubble__container_left_indent;
    } else if (checkSenderLastMessage(id, arr) && !isSender(userId)) {
      return styles.messageBubble__container_left;
    } else if (!checkSenderLastMessage(id, arr) && isSender(userId)) {
      return styles.messageBubble__container_right_tail;
    }
    return styles.messageBubble__container_left_tail;
  }

  return (
    <li className={isSender(userId) ? styles.messageBubble_right : styles.messageBubble}>
      {!isSender(userId) && chat?.isGroup && !checkSenderLastMessage(id, messages)
        ? <div className={styles.messageBubble__avatar}>
          <Avatar src={sender?.imageUrl!} alt={'Avatar'} size={32} />
        </div>
        : ''
      }
      <div className={getBuble(id, messages)}>
        {!isSender(userId) && chat?.isGroup
          ? <div className={styles.user}><h2 className={styles.user__title}>{sender?.firstName}</h2><p className={styles.user__subitle}>{sender?.lastName}</p></div>
          : ''
        }
        {dataImg
          ? <ImgContainer imgs={dataImg} />
          : ''
        }
        <div className={styles.message__textContainer}>
          <p className={isSender(userId) ? styles.message__text : styles.message__text_left}>{title}</p>
          <div className={styles.message__container}>
            <p className={isSender(userId) ? styles.message__time : styles.message__time_left}>{dayjs(createdAt).format('hh:mm A')}</p>
            {isSender(userId)
              ? <div>
                <CheckOutlined type="message" style={{ fontSize: '12px', color: 'green' }} />
                <CheckOutlined type="message" style={{ fontSize: '12px', color: 'green', position: 'relative', right: '4px' }} />
              </div>
              : ''}
          </div>
        </div>
      </div>
      <Space className={styles.messageBubble__icons}>
        <Button
          type="link"
          style={{
            border: 'none',
            height: '10px',
            width: '10px'
          }}
          icon={
            <DeleteOutlined
              onClick={() => removeMessage(chatId, id)}
              style={{
                fontSize: '12px',
                color: '#000'
              }}
            />
          }
        />
      </Space>
    </li>
  )
};
