'use client'

import { useRouter } from "next/navigation";
import styles from "./Error404.module.scss";

export const Error404: React.FC = () => {
  const { back } = useRouter();

  return (
    <main className={styles.error404}>
      <div className={styles.error404__container}>
        <h2 className={styles.error404__title}>404</h2>
        <p className={styles.error404__subtitle}>Страница не найдена</p>
      </div>
      <button className={styles.error404__button} onClick={back}>
        Назад
      </button>
    </main>
  );
};