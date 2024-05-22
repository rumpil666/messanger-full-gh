'use client'

import { Modal } from "antd";
import { useModalStore } from "@/stores/useModalStore";

export const ModalСonfirmation: React.FC = () => {
  const [isModalСonfirmation] = useModalStore(state => [state.isModalСonfirmation]);

  return (
    <Modal
      title={isModalСonfirmation.title}
      open={isModalСonfirmation.isOpen}
      onOk={isModalСonfirmation.onOk}
      onCancel={isModalСonfirmation.onCancel}
      centered={true}
    >
      <p>{isModalСonfirmation.text}</p>
    </Modal>
  );
}