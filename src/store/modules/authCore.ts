import ApiService from '../../services/api'
import { IAuthTokens, isLoggedIn, setAuthTokens, getAccessToken, clearAuthTokens } from 'axios-jwt'
import { ILoginData } from '../../@model/auth'

export default {
  namespaced: true,
  state: {
    isAuthorized: isLoggedIn(),
    accessToken: getAccessToken(),
  },

  getters: {
    isAuthorizedUser: ({ isAuthorized }) => isAuthorized,
    accessToken: ({ accessToken }) => accessToken,
  },

  mutations: {
    SET_AUTH(state, payload: boolean) {
      state.isAuthorized = payload
    },
    SET_ACCESS_TOKEN(state, accessToken) {
      state.accessToken = accessToken
    },
  },

  actions: {
    async login({ commit, dispatch }, authData: ILoginData) {
      const { data }: { data: IAuthTokens } = await ApiService.request({
        type: 'App.V2.Auth',
        data: authData,
      })

      setAuthTokens(data)

      commit('SET_AUTH', true)
      commit('SET_ACCESS_TOKEN', data.accessToken)

      await dispatch('fetchCurrentUser', {}, { root: true })
    },

    async refreshAuth({ commit }, refreshToken: string): Promise<IAuthTokens> {
      const { data }: { data: IAuthTokens } = await ApiService.request(
        {
          type: 'App.V2.Auth.Refresh',
          data: {
            refreshToken,
          },
        },
        { newAxiosInstance: true }
      )

      commit('SET_ACCESS_TOKEN', data.accessToken)

      return data
    },

    clearAuth({ commit }) {
      clearAuthTokens()

      commit('SET_AUTH', false)
    },
  },
}
