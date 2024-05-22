'use client'

import styles from "./CurrentUser.module.scss";
import Image from 'next/image';
import { DropDownCurrentUser } from "../DropDownCurrentUser/DropDownCurrentUser";
import { useUserStore } from "@/stores/useUserStore";

export const CurrentUser: React.FC = () => {
  const [currentUser] = useUserStore(state => [state.user]);

  return (
    <div className={styles.currentUser}>
      {currentUser.imageUrl && (
        <Image
          src={currentUser.imageUrl}
          alt={`${currentUser.lastName} ${currentUser.firstName}`}
          width={150}
          height={150}
          className={styles.currentUser__avatar}
        />
      )}
      <h2 className={styles.currentUser__title}>{`${currentUser?.lastName} ${currentUser?.firstName}`}</h2>
      <DropDownCurrentUser />
    </div>
  )
}