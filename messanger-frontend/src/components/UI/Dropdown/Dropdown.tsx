import { Button, Dropdown } from "antd";
import type { MenuProps } from 'antd';
import { ReactNode } from "react";

interface IDropDownProps {
  items: MenuProps['items']
  icon: ReactNode
  backgroundColor: string
}

export const DropDown: React.FC<IDropDownProps> = ({ items, icon, backgroundColor }) => {

  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
      <Button
        style={{
          backgroundColor: backgroundColor,
          border: 'none',
          boxShadow: 'none'
        }}
        icon={icon}
      >
      </Button>
    </Dropdown>
  )
}