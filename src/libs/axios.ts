import Vue from 'vue'
import axios, { AxiosRequestConfig, AxiosInstance, AxiosError } from 'axios'
import store from '@/store'
import { IAuthTokens, TokenRefreshRequest, applyAuthTokenInterceptor } from 'axios-jwt'

const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<IAuthTokens> =>
  await store.dispatch('refreshAuth', refreshToken)

applyAuthTokenInterceptor(axios, { requestRefresh })
const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  // baseURL: 'https://some-domain.com/api/',
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
})

Vue.prototype.$http = axiosIns

export { AxiosRequestConfig, AxiosInstance, AxiosError }
export default axios
