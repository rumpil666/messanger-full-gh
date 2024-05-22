import { create } from 'zustand';

interface UtilsStore {
  isLoading: boolean

  setLoading: (bool: boolean) => void
};

export const useUtilsStore = create<UtilsStore>()((set, get) => ({
  isLoading: false,

  setLoading: (bool: boolean) => {
    set({
      isLoading: bool
    })
  },
}),
);