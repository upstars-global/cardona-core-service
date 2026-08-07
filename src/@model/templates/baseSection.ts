import type { IValidationError } from '../../services/api/config'
import type { useBaseStoreCore } from '../../stores/baseStoreCore'

export enum PageType {
  Root = 'root',
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
  readonly onReceiveEntity?: CallableFunction
  readonly validationErrorCb?: IValidationErrorCb
  readonly useStore?: BaseStore
}

export enum BaseSectionSlots {
  Actions = 'actions',
}

export interface IBaseSectionSlots {
  [key: string]: (...args: any[]) => any
  default: (props: {
    entityId: string
    entityName: string
    form: any
    canUpdate: boolean
    canRemove: boolean
    canViewSeo: boolean
    canCreateSeo: boolean
    canUpdateSeo: boolean
    onClickRemove: (...args: any[]) => Promise<void>
  }) => any
  [BaseSectionSlots.Actions]: (props: {
    form: any
    loading: boolean
    cancel: () => void
    submit: (isStay: boolean) => Promise<void>
    canUpdate: boolean
  }) => any
}

export enum BaseSectionType {
  Default = 'default',
}
