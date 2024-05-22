import { LogoutOutlined, MoreOutlined, UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import type { MenuProps } from 'antd';
import { useRouter } from "next/navigation";
import { DropDown } from "../UI/Dropdown/Dropdown";
import { useAuthStore } from "@/stores/useAuthStore";

export const DropDownCurrentUser: React.FC = () => {
  const [logout] = useAuthStore(state => [state.logout]);
  const router = useRouter()

  const items: MenuProps['items'] = [
    {
      label: 'Профиль',
      key: '1',
      icon: <UserOutlined />,
      onClick: () => {
        router.push('/profile')
      }
    },
    {
      label: 'Создать групповой чат',
      key: '2',
      icon: <UsergroupAddOutlined />,
      onClick: () => {
        router.push('/create-group-chat')
      }
    },
    {
      label: 'Выйти из аккаунта',
      key: '3',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        logout();
        router.push('/signin')
      }
    }
  ];

  return (
    <DropDown items={items} icon={<MoreOutlined />} backgroundColor={'#f2f2f7'} />
  )
}