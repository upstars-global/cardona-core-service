import { v4 as uuidv4 } from 'uuid'
import { useRoute, useRouter } from 'vue-router'
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from '../../libs/axios'
import axios from '../../libs/axios'
import store from '../../store'
import useToastService from '../../helpers/toasts'
import { convertCamelCase } from '../../helpers'
import { TOKEN_INVALID } from '../../utils/constants'
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
import { i18n } from '@/plugins/i18n'

const INVALID_TOKEN_ERROR = 'TypeError: Failed to execute \'setRequestHeader\' on \'XMLHttpRequest\': String contains non ISO-8859-1 code point.'

const { toastSuccess, toastError, toastErrorMessageString } = useToastService()

const isInvalidTokenError = (error): boolean => error?.toString()?.includes(INVALID_TOKEN_ERROR)

const getLoaderSlug = (url: string, loaderSlug: string): string =>
  loaderSlug ? `${url}${loaderSlug}` : url

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class ApiService {
  static async request(payload: IApiServiceRequestPayload, config: IApiServiceConfig = {}, retryCount = 0, retryDelay = 1000) {
    const router = useRouter()
    const route = useRoute()

    const {
      method = Method.POST,
      contentType = ContentType.JSON,
      withErrorToast = true,
      withErrorDescriptionToast = false,
      withErrorNotFound = true,
      withSuccessToast = false,
      successToastDescription = undefined,
      withLoader = true,
      formRef = null,
      newAxiosInstance = false,
      entityName = '',
      rejectError = true,
      loaderSlug = '',
      responseType = 'json',
    } = config

    const convertedType: Array<string> = payload.type
      .replace('App', '/api')
      .split('.')
      .map(word => convertCamelCase(word, '-'))

    const entity: string = entityName || convertedType[2]
    const url: string = convertedType.join('/')

    try {
      if (withLoader)
        store.dispatch('loaderOn', getLoaderSlug(url, loaderSlug))

      const axiosInstance: AxiosInstance = newAxiosInstance ? axios.create() : axios

      const headers: { 'Content-Type': string } = {
        'Content-Type': contentType,
      }

      const body: FormData | any
        = contentType === ContentType.FormData && payload.formData
          ? this.createFormData(payload.formData)
          : JSON.stringify({
            ...payload,
            requestId: uuidv4(),
          })

      const { data }: any = await axiosInstance({
        url,
        method,
        headers,
        data: body,
        responseType,
      } as AxiosRequestConfig)

      if (data.error || (!data.data && !url.includes('report')))
        throw data.error

      if (withSuccessToast)
        toastSuccess(url, { defaultDescription: successToastDescription })

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

      const isLoginPage: boolean = route?.name === 'Login'
      const isInvalidToken = isInvalidTokenError(error)
      const errorsType = ['UNAUTHORIZED', 'BAD_CREDENTIALS', 'TOKEN_EXPIRED', TOKEN_INVALID]

      if (store.getters['authCore/isAuthorizedUser'] && errorsType.includes(error?.type) || isInvalidToken) {
        toastError(TOKEN_INVALID)
        store.dispatch('authCore/clearAuth')

        if (!isLoginPage)
          router.push({ name: 'Login' })
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
      store.dispatch('loaderOff', getLoaderSlug(url, loaderSlug))
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
        const { validationErrorCb } = formRef
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
}

export default ApiService
export { Method, ContentType }
