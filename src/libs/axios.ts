import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { IAuthTokens, TokenRefreshRequest } from 'axios-jwt'
import { applyAuthTokenInterceptor } from 'axios-jwt'
import store from '../store'

const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<IAuthTokens> =>
  await store.dispatch('authCore/refreshAuth', refreshToken)

applyAuthTokenInterceptor(axios, { requestRefresh })

export { AxiosRequestConfig, AxiosInstance, AxiosError }
export default axios
