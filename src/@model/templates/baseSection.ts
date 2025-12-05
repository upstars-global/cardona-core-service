import type { IValidationError } from '../../services/api/config'
import type { useBaseStoreCore } from '../../stores/baseStoreCore'

export enum PageType {
  Create = 'create',
  Update = 'update',
  Empty = '',
}

export type IValidationErrorCb = (entity: string, payload: IValidationError) => { localeKey: string; fieldKey?: string; toastOptions?: object }
export type BaseStore = ReturnType<typeof useBaseStoreCore>

export interface UseEntityType<FormModel> {
  readonly entityName: string
  readonly pageName?: string
  readonly EntityFormClass?: new (...args: any[]) => FormModel
  readonly onSubmitCallback?: (id: string) => void
  readonly onBeforeSubmitCb?: (formData: FormModel) => boolean
  readonly onSerializeFormCb?: (
    transformedFormData: Partial<Record<keyof FormModel, unknown>>,
    rawFormData: Ref<FormModel>
  ) => Record<string, unknown>
  readonly validationErrorCb?: IValidationErrorCb
  readonly useStore?: BaseStore
}

export enum BaseSectionSlots {
  Actions = 'actions',
}

export enum BaseSectionType {
  Default = 'default',
}
