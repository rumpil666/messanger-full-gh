import styles from './Loader.module.scss'

export const Loader: React.FC = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.loader__container}>
        <span className={styles.loader__round}></span>
      </div>
    </div>
  );
}