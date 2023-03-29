import axios, { AxiosRequestConfig, AxiosInstance, AxiosError } from '../../libs/axios'
import {
  IApiServiceConfig,
  IResponseError,
  ContentType,
  Method,
  IValidationError,
  IApiServiceRequestPayload,
} from './config'
import { getters, dispatch } from '../../store'
import { v4 as uuidv4 } from 'uuid'
import useToastService from '../../helpers/toasts'
import router from '../../router'
import i18n from '../../libs/i18n'
import { convertCamelCase } from '../../helpers'

const { toastSuccess, toastError, toastErrorMessageString } = useToastService()

class ApiService {
  static async request(payload: IApiServiceRequestPayload, config: IApiServiceConfig = {}) {
    const {
      method = Method.POST,
      contentType = ContentType.JSON,
      withErrorToast = true,
      withErrorDescriptionToast = false,
      withErrorNotFound = true,
      withSuccessToast = false,
      withLoader = true,
      formRef = null,
      newAxiosInstance = false,
    } = config

    const convertedType: Array<string> = payload.type
      .replace('App', '/api')
      .split('.')
      .map((word) => convertCamelCase(word, '-'))
    const entity: string = convertedType[2]
    const url: string = convertedType.join('/')

    try {
      if (withLoader) dispatch('loaderOn', url)

      const axiosInstance: AxiosInstance = newAxiosInstance ? axios.create() : axios
      const headers: { 'Content-Type': string } = {
        'Content-Type': contentType,
      }
      const body: FormData | any =
        contentType === ContentType.FormData && payload.formData
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

      if (data.error) throw data.error

      if (withSuccessToast) toastSuccess(url)

      return data
    } catch (error: any) {
      const isLoginPage: boolean = router.currentRoute.name === 'Login'

      const errorsType = ['UNAUTHORIZED', 'BAD_CREDENTIALS', 'TOKEN_EXPIRED', 'TOKEN_INVALID']

      if (getters.isAuthorizedUser && errorsType.includes(error.type)) {
        dispatch('clearAuth')

        if (!isLoginPage) router.push({ name: 'Login' })
      }

      const notVisibleErrorToast = !withErrorNotFound && error.type === 'NOT_FOUND'
      if (!notVisibleErrorToast) {
        if (withErrorToast) this.showError(error, entity, formRef, withErrorDescriptionToast)
      }

      return Promise.reject(error)
    } finally {
      dispatch('loaderOff', url)
    }
  }

  private static createFormData(data: object): FormData {
    if (data instanceof FormData) return data

    const formData = new FormData()

    for (const key in data) {
      formData.append(key, data[key])
    }

    return formData
  }

  private static showError(
    error: IResponseError | AxiosError | string | any,
    entity: string,
    formRef: any,
    withErrorDescriptionToast: boolean
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
    } else if (withErrorDescriptionToast && error.description) {
      toastErrorMessageString(error.description)
    } else if (error.type) {
      toastError(error.type)
    } else if (error.isAxiosError) {
      toastError('axiosError')
    }
  }
}

export default ApiService
export { Method, ContentType }
