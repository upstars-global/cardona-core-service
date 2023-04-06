import ApiService from '../../services/api'
import router from '@/router'
import { IAuthTokens, isLoggedIn, setAuthTokens, clearAuthTokens } from 'axios-jwt'
import { ILoginData } from '../../@model/auth'

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
      const { data }: { data: IAuthTokens } = await ApiService.request({
        type: 'App.V2.Auth',
        data: authData,
      })

      setAuthTokens(data)

      commit('SET_AUTH', true)

      await dispatch('fetchCurrentUser', {}, { root: true })

      await router.push({ name: 'Dashboard' })
    },

    async refreshAuth() {
      // const { data }: { data: IAuthTokens } = await ApiService.request(
      //   {
      //     type: 'App.V2.Auth.Refresh',
      //     data: {
      //       refreshToken,
      //     },
      //   },
      //   { newAxiosInstance: true }
      // )
      //
      // return data
    },

    clearAuth({ commit }) {
      clearAuthTokens()

      commit('SET_AUTH', false)
    },
  },
}
