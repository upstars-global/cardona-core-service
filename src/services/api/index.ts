import { v4 as uuidv4 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from '../../libs/axios'
import axios from '../../libs/axios'
import store from '../../store'
import useToastService from '../../helpers/toasts'
import { convertCamelCase } from '../../helpers'
import { TOKEN_INVALID } from '../../utils/constants'
import { useLoaderStore } from '../../stores/loader'
import { i18n } from '../../plugins/i18n/index'
import {
  ContentType,
  Method,
} from './config'
import type {
  IApiServiceConfig,
  IApiServiceRequestPayload,
  IResponseError,
  IValidationError,
} from './config'
import { ApiTypePrefix, isRemovePrefix } from '@productConfig'

const INVALID_TOKEN_ERROR = 'TypeError: Failed to execute \'setRequestHeader\' on \'XMLHttpRequest\': String contains non ISO-8859-1 code point.'
const CACHE_NAME = 'app-cache'
const CACHE_PHRASE = 'Dictionaries'

const CACHE_EXPIRY_TIME = 86400000 // 1 day in milliseconds

const { toastSuccess, toastError, toastErrorMessageString } = useToastService()

const isInvalidTokenError = (error): boolean => error?.toString()?.includes(INVALID_TOKEN_ERROR)

const getLoaderSlug = (url: string, loaderSlug: string): string =>
  loaderSlug ? `${url}${loaderSlug}` : url

interface RequestHeaders { 'Content-Type': string }

const getActionName = (string: string): string => [
  'create',
  'update',
  'delete',
  'active.switch',
].find(action => string
  .toLowerCase()
  .includes(action))
  ?.replace('.', '_') || ''

class ApiService {
  private static headers: RequestHeaders

  static setHeaders(headers: RequestHeaders): void {
    ApiService.headers = headers
  }

  static async request(payload: IApiServiceRequestPayload, config: IApiServiceConfig = {}, retryCount = 0, retryDelay = 1000) {
    const loaderStore = useLoaderStore()
    const router = useRouter()
    const route = useRoute()

    const {
      method = Method.POST,
      contentType = ContentType.JSON,
      withErrorToast = true,
      withErrorDescriptionToast = false,
      withErrorNotFound = true,
      withSuccessToast = false,
      successToastTitle = undefined,
      successToastDescription = undefined,
      withLoader = true,
      formRef = null,
      newAxiosInstance = false,
      entityName = '',
      rejectError = true,
      loaderSlug = '',
      responseType = 'json',
      withResponseHeaders = false,
      cache = payload.type.includes(CACHE_PHRASE),
    } = config

    const convertedType: Array<string> = payload.type
      .replace('App', '/api')
      .split('.')
      .map(word => convertCamelCase(word, '-'))

    const entity: string = entityName || convertedType[2]
    const url: string = convertedType.join('/')
    const cacheRequest = new Request(url)

    if (cache) {
      const cacheStore = await caches.open(CACHE_NAME)
      const cachedResponse = await cacheStore.match(cacheRequest)

      if (cachedResponse) {
        const cachedData = await cachedResponse.json()

        if (this.checkCacheRelevance(cachedData.cachedAt))
          return cachedData

        await cacheStore.delete(cacheRequest)
      }
    }
    try {
      if (withLoader)
        loaderStore.setLoaderOn(getLoaderSlug(url, loaderSlug))

      const axiosInstance: AxiosInstance = newAxiosInstance ? axios.create() : axios

      const headers: RequestHeaders = {
        ...this.headers || {},
        'Content-Type': contentType,
      }

      const body: FormData | any
        = contentType === ContentType.FormData && payload.formData
          ? this.createFormData(payload.formData)
          : JSON.stringify({
            ...payload,
            type: isRemovePrefix ? payload.type.replace(ApiTypePrefix, '') : payload.type,
            requestId: uuidv4(),
          })

      const { data, headers: responseHeaders }: any = await axiosInstance({
        url,
        method,
        headers,
        data: body,
        responseType,
      } as AxiosRequestConfig)

      if (data.error || (!data.data && !url.includes('report')))
        throw data.error

      if (withSuccessToast) {
        const action = getActionName(payload.type)

        const toastTitle = action && i18n.te(`entities.${entity}`)
          ? action
          : url

        toastSuccess(successToastTitle || toastTitle, {
          defaultDescription: successToastDescription,
          entityName: i18n.t(`entities.${entityName}`),
        })
      }

      if (cache)
        await this.setCache(cacheRequest, data, headers)

      if (withResponseHeaders)
        return { data, headers: responseHeaders }

      return data
    }
    catch (error: any) {
      // TODO BAC-4018
      // if (retryCount > 0 && (!error?.description || error?.type === 'INTERNAL')) {
      //   console.log(`Request failed. Waiting ${retryDelay / 1000} sec before next try. Count: ${retryCount}`)
      //   await delay(retryDelay)
      //
      //   return this.request(payload, config, retryCount - 1, retryDelay * 2)
      // }

      if (error?.type === 'NOT_FOUND')
        return router.push('/not-found')

      const isLoginPage: boolean = route?.name === 'Login' || route?.name === 'login'
      const isInvalidToken = isInvalidTokenError(error)
      const errorsType = ['UNAUTHORIZED', 'BAD_CREDENTIALS', 'TOKEN_EXPIRED', TOKEN_INVALID]

      if (store.getters['authCore/isAuthorizedUser'] && errorsType.includes(error?.type) || isInvalidToken) {
        toastError(TOKEN_INVALID)
        store.dispatch('authCore/clearAuth')

        if (!isLoginPage)
          router.push('/login')
      }

      store.dispatch('addErrorUrl', url)

      const notVisibleErrorToast = !withErrorNotFound && error?.type === 'NOT_FOUND'
      if (!notVisibleErrorToast) {
        if (withErrorToast)
          this.showError(error, entity, formRef, withErrorDescriptionToast)
      }

      return rejectError ? Promise.reject(error) : undefined
    }
    finally {
      loaderStore.setLoaderOff(getLoaderSlug(url, loaderSlug))
    }
  }

  private static createFormData(data: object): FormData {
    if (data instanceof FormData)
      return data

    const formData = new FormData()

    for (const key in data)
      formData.append(key, data[key])

    return formData
  }

  private static showError(
    error: IResponseError | AxiosError | string | any,
    entity: string,
    formRef: any,
    withErrorDescriptionToast: boolean,
  ) {
    if (typeof error === 'string') {
      toastError(error)

      return
    }

    if (error.validationErrors) {
      error.validationErrors.forEach(({ code, field, params, template }: IValidationError) => {
        let localizationKey = `${entity}_${field}_${code}`
        const validationErrorCb = formRef?.validationErrorCb
        let options = {}

        if (validationErrorCb) {
          const { localeKey, fieldKey, toastOptions } = validationErrorCb(entity, { code, field, params, template })

          localizationKey = localeKey

          if (fieldKey)
            field = fieldKey

          if (toastOptions)
            options = toastOptions
        }

        if (params.currency)
          field = `${field}_${params.currency}`

        formRef?.setErrors({
          [field]: i18n.te(`validations.${localizationKey}`)
            ? i18n.t(`validations.${localizationKey}`, options)
            : i18n.t(localizationKey, options),
        })

        toastError(localizationKey, { field, defaultCode: 'field_ALREADY_EXISTS', ...options })
      })
    }
    else if (withErrorDescriptionToast && error.description) {
      toastErrorMessageString(error.description)
    }
    else if (error?.type) {
      toastError(error.type, {
        defaultText: error.description,
      })
    }
    else if (error.isAxiosError) {
      toastError('axiosError')
    }
  }

  private static async setCache(cacheRequest: Request, data: Record<string, unknown>, headers: RequestHeaders) {
    const cacheStore = await caches.open(CACHE_NAME)
    const cacheData = new Response(JSON.stringify({ ...data, cachedAt: Date.now() }), { headers })

    await cacheStore.put(cacheRequest, cacheData)
  }

  private static checkCacheRelevance(timestamp = 0): boolean {
    return Date.now() - timestamp < CACHE_EXPIRY_TIME
  }
}

export default ApiService
export { Method, ContentType }
