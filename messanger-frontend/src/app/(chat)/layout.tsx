import styles from "./page.module.scss";
import { CurrentUser } from '@/components/CurrentUser/CurrentUser'
import { ChatList } from '@/components/ChatList/ChatList'
import { type PropsWithChildren } from 'react'

export default function ChatLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className={styles.page}>
      <div className={styles.page__sidebar}>
        <CurrentUser />
        <ChatList />
      </div>
      <div className={styles.page__chat}>{children}</div>
    </div>
  )
}