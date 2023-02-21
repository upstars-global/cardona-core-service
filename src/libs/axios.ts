import axios, { AxiosRequestConfig, AxiosInstance, AxiosError } from 'axios'
import store from '@/store'
import { IAuthTokens, TokenRefreshRequest, applyAuthTokenInterceptor } from 'axios-jwt'

const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<IAuthTokens> =>
  await store.dispatch('refreshAuth', refreshToken)

applyAuthTokenInterceptor(axios, { requestRefresh })

export { AxiosRequestConfig, AxiosInstance, AxiosError }
export default axios
