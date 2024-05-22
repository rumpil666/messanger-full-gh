import { IUser } from '@/types/user.types';
import { $fetch } from '@/$api/api.fetch'
import type { UpdateUser } from "@/types/user.types";

export const userService = {
  async profile(isAuth: boolean) {
    const response = await $fetch.get<IUser[]>(
      `/user/profile`,
      isAuth
    )

    return response;
  },

  async getUsers(nickname: string, isAuth: boolean) {
    const response = await $fetch.get<IUser[]>(
      `/user/profile/users?nickname=${nickname}`,
      isAuth
    )

    return response;
  },

  async updateProfile(data: UpdateUser, isAuth: boolean) {
    const response = await $fetch.put<IUser>(
      `/user/profile`,
      data,
      isAuth
    )

    return response;
  },
}