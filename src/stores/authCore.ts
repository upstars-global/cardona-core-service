import { defineStore } from 'pinia'
import type { IAuthTokens } from 'axios-jwt'
import { clearAuthTokens, setAuthTokens } from 'axios-jwt'
import ApiService from '../services/api'
import type { ILoginData } from '../@model/auth'
import { checkIsLoggedIn } from '../helpers/token-auth'
import { useUserStore } from '../stores/user'
import { useCookie } from '@core/composable/useCookie'

export const useAuthCoreStore = defineStore('authCore', {
  state: () => ({
    isAuthorized: checkIsLoggedIn(),
  }),

  getters: {
    isAuthorizedUser: state => state.isAuthorized,
  },

  actions: {
    // SET_AUTH(val: boolean) {
    setAuthState(val: boolean) {
      this.isAuthorized = val
    },

    async googleAuth(code: string) {
      try {
        const { data }: { data: IAuthTokens } = await ApiService.request({
          type: 'App.V2.Auth.Google',
          data: { code },
        })

        await this.setAuth(data)
      }
      catch {}
    },

    async login(authData: ILoginData) {
      try {
        const { data }: { data: IAuthTokens } = await ApiService.request({
          type: 'App.V2.Auth',
          data: authData,
        })

        await this.setAuth(data)
      }
      catch {}
    },

    async setAuth(data: IAuthTokens) {
      try {
        setAuthTokens(data)
        this.setAuthState(true)
        await useUserStore().fetchCurrentUser()
      }
      catch {}
    },

    async refreshAuth(refreshToken: string): Promise<IAuthTokens> {
      try {
        const { data }: { data: IAuthTokens } = await ApiService.request(
          {
            type: 'App.V2.Auth.Refresh',
            data: { refreshToken },
          },
          { newAxiosInstance: true, withErrorToast: false },
        )

        return data
      }
      catch {
        return '' as any
      }
    },

    clearAuth() {
      useCookie('userData').value = null
      useCookie('accessToken').value = null
      clearAuthTokens()
      this.setAuthState(false)

      ///      dispatch('filtersCore/clearLocalDefaultFilters', null, { root: true })
      // dispatch root action
      // this.$pinia._s.get('filtersCore')?.clearLocalDefaultFilters()
    },
  },
})
