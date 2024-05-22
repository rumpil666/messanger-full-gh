import { EllipsisOutlined, LogoutOutlined, UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { useModalStore, resetModalСonfirmation } from "@/stores/useModalStore";
import type { MenuProps } from 'antd';
import { useRouter } from "next/navigation";
import { DropDown } from "../UI/Dropdown/Dropdown";
import { useUserStore } from "@/stores/useUserStore";
import { useChatStore } from "@/stores/useChatStore";
import { removeChatEvent, removeUserFromChatEvent } from "@/utils/socket";

interface IDropDownChatProps {
  isGroup: boolean
  isAdmin: boolean
  chatId: string
}

export const DropDownChat: React.FC<IDropDownChatProps> = ({ isGroup, isAdmin, chatId }) => {
  const [currentUser] = useUserStore(state => [state.user]);
  const [removeChat, removeUserFromChat] = useChatStore(state => [state.removeChat, state.removeUserFromChat]);
  const [setIsModalСonfirmation] = useModalStore(state => [state.setIsModalСonfirmation]);
  const { replace, push } = useRouter()

  function getItem(): MenuProps['items'] {
    if (isGroup && isAdmin) {
      return (
        [
          {
            label: 'Редактировать чат',
            key: '1',
            icon: <UserOutlined />,
            onClick: () => {
              push(`/update-chat/${chatId}`)
            }
          },
          {
            label: 'Удалить чат',
            key: '2',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => {
              setIsModalСonfirmation(
                true,
                () => {
                  setIsModalСonfirmation(...resetModalСonfirmation)
                  removeChat(chatId, (res) => {
                    removeChatEvent(chatId)
                  })
                  replace('/')
                },
                () => {
                  setIsModalСonfirmation(...resetModalСonfirmation)
                },
                "Пoдтверждение удаления чата",
                `Вы точно хотите удалить чат? Это дейтсвие удалит чат у всех безвозвратно!!!`,
              )
            }
          }
        ]
      )
    } else if (isGroup) {
      return (
        [
          {
            label: 'Выйти из чата',
            key: '1',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => {
              setIsModalСonfirmation(
                true,
                () => {
                  removeUserFromChat(chatId, { participants: [currentUser.nickname!] }, (res) => {
                    removeUserFromChatEvent(res)
                  })
                  setIsModalСonfirmation(...resetModalСonfirmation)
                  replace('/')
                },
                () => {
                  setIsModalСonfirmation(...resetModalСonfirmation)
                },
                "Подтверждение выхода из чата",
                `Вы точно хотите покинуть чать?`,
              )
            }
          }
        ]
      )
    } else {
      return (
        [
          {
            label: 'Удалить чат',
            key: '1',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => {
              setIsModalСonfirmation(
                true,
                () => {
                  replace('/')
                  setIsModalСonfirmation(...resetModalСonfirmation)
                  removeChat(chatId, (res) => {
                    removeChatEvent(chatId)
                  })
                },
                () => {
                  setIsModalСonfirmation(...resetModalСonfirmation)
                },
                "Пoдтверждение удаления чата",
                `Вы точно хотите удалить чат? Это дейтсвие удалит чат у всех безвозвратно!!!`,
              )
            }
          }
        ]
      )
    }
  }

  return (
    <DropDown items={getItem()} icon={<EllipsisOutlined />} backgroundColor={'#fff'} />
  )
}