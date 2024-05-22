import { IAuthForm, IAuthResponse } from '@/types/auth.types';
import type { TLogin } from '@/types/auth.types';
import { $fetch } from '@/$api/api.fetch'
import { removeFromStorage, saveTokenStorage } from './auth-token.service';

export const authService = {
  async main(type: 'login' | 'register', data: TLogin | IAuthForm): Promise<IAuthResponse> {
    const response = await $fetch.post<IAuthResponse>(
      `/auth/${type}`,
      data
    )

    if (response.user) saveTokenStorage(response.accessToken);

    return response;
  },

  async getNewTokens() {
    const response = await $fetch.post<IAuthResponse>(
      '/auth/login/access-token'
    )

    if (response.accessToken) saveTokenStorage(response.accessToken)
    return response
  },

  async logout() {
    const response = await $fetch.post<boolean>(
      '/auth/logout'
    )

    if (response) removeFromStorage()
    return response
  }
}