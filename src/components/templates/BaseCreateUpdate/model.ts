export enum PageType {
  Create = 'create',
  Update = 'update',
}

export type UseEntityType = {
  readonly entityName: string
  readonly pageName?: string
  readonly EntityFormClass: Function
}
