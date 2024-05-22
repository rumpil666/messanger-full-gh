import { useCallback, useState, useRef, useEffect } from "react";
import styles from "./NewMessage.module.scss";
import { SmileOutlined, SendOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { PopupPreview } from "@/components/PopupPreview/PopupPreview";
import { Upload } from "../Upload/Upload";
import { CustomInput } from "../CustomInput/CustomInput";
import { sendMessageEvent } from "@/utils/socket";
import { getBase64 } from "@/utils/helpers";
import { useChatStore } from "@/stores/useChatStore";

interface NewMessageProps {
  chatId?: string
}

export const NewMessage: React.FC<NewMessageProps> = ({ chatId }) => {
  const [sendMessage] = useChatStore(state => [state.sendMessage]);

  const inputRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [popupOpened, setPopupOpened] = useState(false)

  const handleSendClick = useCallback(() => {
    sendMessage(chatId!, { messageBody: inputValue }, (message, papticipant) => sendMessageEvent(message, papticipant));
    setInputValue('')
    if (inputRef.current !== null) inputRef.current.textContent = '';

  }, [chatId, sendMessage, inputValue]);

  const buttonDisabled = (): boolean => {
    if (inputValue === "") return true;
    return false
  };

  const onInput = (e: any): void => {
    e.preventDefault();
    let eventTarget = e.target as HTMLElement;
    setInputValue(eventTarget.textContent || '');
  };

  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && inputValue !== "") {
      e.preventDefault();
      handleSendClick()
    };
    if (e.key === 'Enter') return e.preventDefault();
  };

  const onClose = (): void => {
    setPopupOpened(false)
    setImageUrl([])
  }

  const onChangeUpload = async (e: any, ref: any) => {
    const files = e.target.files;
    const arr: string[] = [];

    for (let i = 0; i < files.length; i++) {
      getBase64(files[i] as File, (url) => {
        arr.push(url)
      });
    }
    setImageUrl(arr);
    setTimeout(() => {
      setPopupOpened(true);
    }, 1)
    ref.current.value = '';
  }

  return (
    <>
      <section className={styles.newMessage}>
        <Button style={{ border: 'none', height: '48px' }} icon={<SmileOutlined width={'16px'} height={'16px'} />} />
        <CustomInput
          buttonDisabled={buttonDisabled()}
          onInput={onInput}
          handleEnter={handleEnter}
          inputRef={inputRef}
        />
        <Upload
          onChange={onChangeUpload}
        />
        <Button
          type="link"
          onClick={() => handleSendClick()}
          disabled={buttonDisabled()}
          style={{ border: 'none', height: '48px', cursor: 'unset' }}
          icon={<SendOutlined width={'16px'} height={'16px'} />}
        />
      </section>
      <PopupPreview
        chatId={chatId!}
        opened={popupOpened}
        dataImg={imageUrl}
        onSend={sendMessage}
        onClose={onClose}
      />
    </>
  )
};