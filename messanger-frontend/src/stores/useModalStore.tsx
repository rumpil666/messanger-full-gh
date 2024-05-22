import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware'

interface IModalInfo {
  isOpen: boolean
  isSuccess: boolean
  message: string
}

interface IModalСonfirmation {
  isOpen: boolean
  onOk: () => void
  onCancel: () => void
  title: string
  text: string
}

interface ModalStore {
  isModalInfo: IModalInfo
  isModalСonfirmation: IModalСonfirmation
  setIsModalInfo: (isOpen: boolean, isSuccess: boolean, message: string) => void
  setIsModalСonfirmation: (isOpen: boolean, onOk: () => void, onCancel: () => void, title: string, text: string) => void
};

type ModalTuple = [boolean, () => void, () => void, string, string];

export const resetModalСonfirmation: ModalTuple = [false, () => { }, () => { }, '', '']

export const useModalStore = create<ModalStore>()((set, get) => ({
  isModalInfo: {
    isOpen: false,
    isSuccess: true,
    message: "",
  },

  isModalСonfirmation: {
    isOpen: false,
    onOk: () => { },
    onCancel: () => { },
    title: "",
    text: "",
  },

  setIsModalInfo: (isOpen: boolean, isSuccess: boolean, message: string) => {
    set({
      isModalInfo: {
        isOpen,
        isSuccess,
        message,
      }
    })
  },

  setIsModalСonfirmation: (isOpen: boolean, onOk: () => void, onCancel: () => void, title: string, text: string) => {
    set({
      isModalСonfirmation: {
        isOpen,
        onOk,
        onCancel,
        title,
        text
      }
    })
  },
})
);