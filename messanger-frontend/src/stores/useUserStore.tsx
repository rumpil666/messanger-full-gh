import { userService } from '@/services/user.service';
import { IUser } from '@/types/user.types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware'
import { useUtilsStore } from './useUtilsStore';
import type { UpdateUser } from "@/types/user.types";

interface UserStore {
  user: IUser
  foundUsers: IUser[],
  setUser: (data: IUser) => void
  updateProfile: (user: UpdateUser) => Promise<void>
  searchUser: (nickname: string) => Promise<void>
};

localStorage.getItem('user-storage')
const setLoading = useUtilsStore.getState().setLoading;

export const useUserStore = create<UserStore>()(persist((set, get) => ({
  user: {} as IUser,
  foundUsers: [],

  setUser: (data: IUser) => {
    set({ user: data })
  },

  updateProfile: async (user: UpdateUser) => {
    setLoading(true)
    await userService
      .updateProfile(user, true)
      .then((res) => {
        set({ user: res })
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setLoading(false))
  },

  searchUser: async (nickname: string) => {
    setLoading(true)
    await userService
      .getUsers(nickname, true)
      .then((res) => {
        set({
          foundUsers: res.filter((_, i) => i < 10)
        })
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setLoading(false))
  },
}),
  {
    name: 'user-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ ...state }),
  },
));