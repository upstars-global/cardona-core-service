import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { IAuthTokens, TokenRefreshRequest } from 'axios-jwt'
import { applyAuthTokenInterceptor } from 'axios-jwt'
import { useAuthCoreStore } from '../stores/authCore'

const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<IAuthTokens> =>
  await useAuthCoreStore().refreshAuth(refreshToken)

applyAuthTokenInterceptor(axios, { requestRefresh })

export { AxiosRequestConfig, AxiosInstance, AxiosError }
export default axios
