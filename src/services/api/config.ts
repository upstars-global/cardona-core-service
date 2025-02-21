import type { IListSort, PaginationData } from '../../@model'

// ContentType
interface IContentType {
  readonly JSON: string
  readonly FormData: string
}

export const ContentType: IContentType = {
  JSON: 'application/json',
  FormData: 'multipart/form-data',
}

// Method
interface IMethod {
  readonly GET: string
  readonly POST: string
  readonly PUT: string
  readonly PATCH: string
  readonly DELETE: string
}

export const Method: IMethod = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
}

// Request payload
export interface IApiServiceRequestPayload {
  readonly type: string
  readonly data?: object
  readonly pagination?: PaginationData
  readonly filter?: object
  readonly sort?: Array<IListSort>
  readonly formData?: FormData | object
}

// Request config
export interface IApiServiceConfig {
  readonly method?: string
  readonly contentType?: string
  readonly withErrorNotFound?: boolean
  readonly withErrorToast?: boolean
  readonly withErrorDescriptionToast?: boolean
  readonly withSuccessToast?: boolean
  readonly successToastDescription?: string | undefined
  readonly withLoader?: boolean
  readonly formRef?: any
  readonly newAxiosInstance?: boolean
  readonly entityName?: string
  readonly rejectError?: boolean
  readonly loaderSlug?: string
  readonly responseType?: 'json' | 'blob'
}

// Response error
export interface IResponseError {
  readonly type: string
  readonly description: string
  readonly validationErrors?: Array<IValidationError>
}

export interface IValidationError {
  readonly code: string
  readonly field: string
  readonly template: string
  readonly params: Record<string, string>
}
