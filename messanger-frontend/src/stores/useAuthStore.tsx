import { authService } from '@/services/auth.service';
import { IAuthForm } from '@/types/auth.types';
import type { TLogin } from "@/types/auth.types";
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware'
import { useModalStore } from './useModalStore';
import { useUserStore } from './useUserStore';
import { useUtilsStore } from './useUtilsStore';
import { IUser } from '@/types/user.types';

interface AuthStore {
  isAuth: boolean
  login: (data: TLogin, replace?: (href: string, options?: NavigateOptions | undefined) => void) => Promise<void>
  register: (data: IAuthForm, replace?: (href: string, options?: NavigateOptions | undefined) => void) => Promise<void>
  logout: () => Promise<void>
};

const setIsModalInfo = useModalStore.getState().setIsModalInfo;
const setUser = useUserStore.getState().setUser;
const setLoading = useUtilsStore.getState().setLoading;

export const useAuthStore = create<AuthStore>()(persist((set, get) => ({
  isAuth: false,

  login: async (data: TLogin, replace?: (href: string, options?: NavigateOptions | undefined) => void) => {
    setLoading(true)
    await authService
      .main('login', data)
      .then((res) => {
        setUser(res.user)
        set({ isAuth: true })
        if (replace) replace('/')
      })
      .catch((err: string) => {
        console.log(`Ошибка: ${err}`);
        setIsModalInfo(true, false, "Что-то пошло не так, попробуйте снова")
      })
      .finally(() => {
        setLoading(false)
      })
  },

  register: async (data: IAuthForm, replace?: (href: string, options?: NavigateOptions | undefined) => void) => {
    setLoading(true)
    await authService
      .main('register', data)
      .then((res) => {
        setUser(res.user)
        set({ isAuth: true })
        if (replace) replace('/')
      })
      .catch((err: string) => {
        console.log(`Ошибка: ${err}`);
        setIsModalInfo(true, false, `${err == "Error: Conflict"
          ? "Пользователь с таким email или псевдонимом уже существует"
          : "Упс, что-то пошло не так, попробуйте снова"
          }`)
      })
      .finally(() => {
        setLoading(false)
      })
  },

  logout: async () => {
    setLoading(true)
    await authService
      .logout()
      .then(() => {
        setUser({} as IUser)
        localStorage.clear()
        set({ isAuth: false })
      })
      .catch((err: string) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => {
        setLoading(false)
      })
  },
}),
  {
    name: 'auth-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ ...state }),
  },
));