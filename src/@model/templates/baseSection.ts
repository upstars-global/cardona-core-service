export enum PageType {
  Create = 'create',
  Update = 'update',
  Empty = '',
}

export interface UseEntityType<T> {
  readonly entityName: string
  readonly pageName?: string
  readonly EntityFormClass: { new (data?: any): T }
  readonly onSubmitCallback?: (id: string) => void
  readonly onBeforeSubmitCb?: (formData: any) => boolean
  readonly mapFormData?: (transformedFormData: unknown, rawFormData: Ref<unknown>) => unknown
}
export default {}
