import { v4 as uuidv4 } from 'uuid'
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from '../../libs/axios'
import axios from '../../libs/axios'
import store from '../../store'
import useToastService from '../../helpers/toasts'
import { convertCamelCase } from '../../helpers'
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
import { router } from '@/plugins/1.router'

const { toastSuccess, toastError, toastErrorMessageString } = useToastService()

const getLoaderSlug = (url: string, loaderSlug: string): string =>
  loaderSlug ? `${url}${loaderSlug}` : url

class ApiService {
  static async request(payload: IApiServiceRequestPayload, config: IApiServiceConfig = {}) {
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
      } as AxiosRequestConfig)

      if (data.error)
        throw data.error

      if (withSuccessToast)
        toastSuccess(url, { defaultDescription: successToastDescription })

      return data
    }
    catch (error: any) {
      const isLoginPage: boolean = router.currentRoute.value.name === 'Login'

      const errorsType = ['UNAUTHORIZED', 'BAD_CREDENTIALS', 'TOKEN_EXPIRED', 'TOKEN_INVALID']

      if (store.getters['authCore/isAuthorizedUser'] && errorsType.includes(error.type))
        store.dispatch('authCore/clearAuth')

      if (!isLoginPage)
        router.push({ name: 'Login' })

      store.dispatch('addErrorUrl', url)

      const notVisibleErrorToast = !withErrorNotFound && error.type === 'NOT_FOUND'
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
      error.validationErrors.forEach(({ code, field }: IValidationError) => {
        const localizationKey = `${entity}_${field}_${code}`

        formRef?.setErrors({
          [field]: i18n.t(`validations.${localizationKey}`),
        })

        toastError(localizationKey, { field, defaultCode: 'field_ALREADY_EXISTS' })
      })
    }
    else if (withErrorDescriptionToast && error.description) {
      toastErrorMessageString(error.description)
    }
    else if (error.type) {
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
