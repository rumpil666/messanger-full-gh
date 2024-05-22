'use client'

import { Modal } from "antd";
import { useModalStore } from "@/stores/useModalStore";

export const ModalInfo: React.FC = () => {
  const [isModalInfo, setIsModalInfo] = useModalStore(state => [state.isModalInfo, state.setIsModalInfo]);

  return (
    <Modal
      title={'Ошибка'}
      open={isModalInfo.isOpen}
      onOk={() => setIsModalInfo(false, false, '')}
      onCancel={() => setIsModalInfo(false, false, '')}
      centered={true}
      footer={(_, { OkBtn }) => (
        <OkBtn />
      )}
    >
      <p>{isModalInfo.message}</p>
    </Modal>
  );
}