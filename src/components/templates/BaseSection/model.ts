export enum PageType {
  Create = 'create',
  Update = 'update',
}

export type UseEntityType<T> = {
  readonly entityName: string
  readonly pageName?: string
  readonly EntityFormClass: { new (data?: any): T }
}
