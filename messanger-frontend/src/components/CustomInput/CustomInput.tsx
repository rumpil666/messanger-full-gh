import { RefObject } from "react";
import styles from "./CustomInput.module.scss";

interface CustomInputProps {
  buttonDisabled: boolean;
  inputRef: RefObject<HTMLDivElement>;
  onInput: (e: any) => void;
  handleEnter: (e: any) => void;
}

export const CustomInput: React.FC<CustomInputProps> = ({ buttonDisabled, inputRef, onInput, handleEnter }) => {

  return (
    <div className={styles.customInput}>
      <span className={`${styles.customInput__placeholder} ${buttonDisabled ? styles.isEmpty : ''}`}>Start typing...</span>
      <div
        className={styles.customInput__input}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={onInput}
        onKeyDown={handleEnter}
        ref={inputRef}
      >
      </div>
    </div>
  )
}