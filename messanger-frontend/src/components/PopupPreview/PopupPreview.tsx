import { useCallback, useState, useRef, useEffect } from "react";
import { Button } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import styles from "./PopupPreview.module.scss";
import { CustomInput } from "../CustomInput/CustomInput";
import { ImgContainer } from '../ImgContainer/ImgContainer';
import { IMessage, ISendMessage } from "@/types/chat.types";
import { sendMessageEvent } from "@/utils/socket";

interface PopupPreviewProps {
  chatId: string
  opened: boolean
  dataImg: string[]
  onSend: (chatId: string, message: ISendMessage, event?: (message: IMessage, participants: string[]) => void) => void
  onClose: () => void
}

export const PopupPreview: React.FC<PopupPreviewProps> = ({ chatId, opened, dataImg, onSend, onClose }) => {
  const inputRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState<string>('');
  const [imgs, setImgs] = useState<string[]>([]);

  const sendMessage = useCallback(() => {
    onSend(chatId, { messageBody: inputValue, fileList: dataImg }, (message, papticipant) => sendMessageEvent(message, papticipant));
    setInputValue('');
    onClose();
    if (inputRef.current !== null) inputRef.current.textContent = '';
  }, [dataImg, inputValue, onClose, onSend]);

  const onInput = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const eventTarget = e.target as HTMLElement;
    setInputValue(eventTarget.textContent || '');
  };

  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && inputValue !== "") {
      e.preventDefault();
      sendMessage();
    };
    if (e.key === 'Enter') return e.preventDefault();
  };

  const buttonDisabled = (): boolean => {
    if (inputValue === "") return true;
    return false
  };

  useEffect(() => {
    setImgs(dataImg)
  }, [dataImg])


  return (
    <div className={`${styles.popup} ${opened ? styles.popup_opened : ''}`}>
      <div className={styles.popup__container}>
        <Button className={styles.popup__close} aria-label="Закрыть" icon={<CloseOutlined />} onClick={onClose} />
        <h2 className={styles.popup__title}>Edit image</h2>

        <ImgContainer
          imgs={imgs}
        />
        <div className={styles.popup__sendContainer}>
          <CustomInput
            buttonDisabled={buttonDisabled()}
            onInput={onInput}
            handleEnter={handleEnter}
            inputRef={inputRef}
          />
          <Button className={styles.popup__send} type="primary" onClick={sendMessage}>SEND</Button>
        </div>
      </div>
    </div>
  );
}