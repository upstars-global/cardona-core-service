import type { IAuthTokens } from 'axios-jwt'
import { clearAuthTokens, isLoggedIn, setAuthTokens } from 'axios-jwt'
import ApiService from '../../services/api'
import type { ILoginData } from '../../@model/auth'

export default {
  namespaced: true,
  state: {
    isAuthorized: isLoggedIn(),
  },

  getters: {
    isAuthorizedUser: ({ isAuthorized }) => isAuthorized,
  },

  mutations: {
    SET_AUTH(state, payload: boolean) {
      state.isAuthorized = payload
    },
  },

  actions: {
    async login({ commit, dispatch }, authData: ILoginData) {
      try {
        const { data }: { data: IAuthTokens } = await ApiService.request({
          type: 'App.V2.Auth',
          data: authData,
        })

        setAuthTokens(data)

        commit('SET_AUTH', true)

        await dispatch('fetchCurrentUser', {}, { root: true })
      }
      catch {

      }
    },

    async refreshAuth(context, refreshToken: string): Promise<IAuthTokens> {
      const { data }: { data: IAuthTokens } = await ApiService.request(
        {
          type: 'App.V2.Auth.Refresh',
          data: {
            refreshToken,
          },
        },
        { newAxiosInstance: true },
      )

      return data
    },

    clearAuth({ commit }) {
      clearAuthTokens()

      commit('SET_AUTH', false)
    },
  },
}
