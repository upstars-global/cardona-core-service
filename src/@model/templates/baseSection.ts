export enum PageType {
  Create = 'create',
  Update = 'update',
}

export interface UseEntityType<T> {
  readonly entityName: string
  readonly pageName?: string
  readonly EntityFormClass: { new (data?: any): T }
  readonly onSubmitCallback?: (id: string) => void
  readonly onBeforeSubmitCb?: (formData: any) => Promise<boolean>
}
export default {}
