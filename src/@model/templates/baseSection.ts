import type { IValidationError } from '../../services/api/config'

export enum PageType {
  Create = 'create',
  Update = 'update',
  Empty = '',
}

export type IValidationErrorCb = (entity: string, payload: IValidationError) => { localeKey: string; fieldKey?: string; toastOptions?: object }

export interface UseEntityType<T> {
  readonly entityName: string
  readonly pageName?: string
  readonly EntityFormClass: { new (data?: any): T }
  readonly onSubmitCallback?: (id: string) => void
  readonly onBeforeSubmitCb?: (formData: any) => boolean
  readonly onSerializeFormCb?: (transformedFormData: unknown, rawFormData: Ref<unknown>) => unknown
  readonly validationErrorCb?: IValidationErrorCb
}
export default {}
