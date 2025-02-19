interface IRouterConfig {
  name: string
  sectionName?: string
  isProject?: boolean
  isPermissionGroup?: boolean
  isConvertName?: boolean
  withCard?: boolean
}

export class RouterConfig {
  readonly name: string
  readonly sectionName?: string
  readonly isProject?: boolean
  readonly isPermissionGroup?: boolean
  readonly isConvertName?: boolean
  readonly withCard?: boolean

  constructor({ name, sectionName, isProject, isPermissionGroup, isConvertName, withCard }: IRouterConfig) {
    this.name = name
    this.sectionName = sectionName
    this.isProject = isProject
    this.isPermissionGroup = isPermissionGroup
    this.isConvertName = isConvertName
    this.withCard = withCard
  }
}
