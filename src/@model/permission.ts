import permissions from '@permissions'

export type PermissionUpdatableType = 'switch' | 'table'
export enum PermissionLevel {
  noaccess = 'noaccess',
  view = 'view',
  create = 'create',
  update = 'update',
  delete = 'delete',
}

export interface PermissionInput {
  readonly access: number
  readonly target: string
}

export class Permission {
  private _access: number
  readonly target: string

  constructor(data: PermissionInput) {
    this._access = data.access
    this.target = data.target
  }

  public changeAccess(access: number) {
    this._access = access
  }

  get access() {
    return this._access
  }

  toJSON() {
    return {
      access: this._access,
      target: this.target,
    }
  }
}

interface PermissionTriggerInput {
  readonly addictionLevelItem: number
  readonly itemActive: PermissionInput[]
  readonly addiction?: PermissionInput[]
}
interface PermissionUpdatableInput extends PermissionInput {
  readonly type: PermissionUpdatableType
  readonly addiction?: PermissionInput[]
  readonly trigger?: PermissionTriggerInput[]
  readonly notAccessLevel?: number[]
}
export class PermissionUpdatableTable extends Permission implements PermissionUpdatableInput {
  readonly type: PermissionUpdatableType
  readonly trigger?: PermissionTriggerInput[]
  readonly notAccessLevel?: number[]

  constructor(data: PermissionUpdatableInput) {
    super({ ...data, access: data.access ? data.access : 0 })

    this.type = data.type
    this.trigger = data.trigger || []
    this.notAccessLevel = data.notAccessLevel || [0]
  }
}
export class PermissionUpdatableTableList {
  readonly title?: string
  readonly permissions?: PermissionUpdatableTable[]

  constructor(data) {
    this.title = data?.title
    this.permissions = data.permissions || []
  }
}

export class AllPermission {
  private _allPermission = {
    ...permissions,
  }

  constructor(permission?: PermissionInput[]) {
    if (permission) {
      this.setAccessAllPermission(permission)
    }
  }
  private getInitAccessByTarget(permission: PermissionInput[], target: string) {
    const item = permission?.find((item) => target === item.target)
    return item?.access || 0
  }

  public setAccessAllPermission(permission: PermissionInput[]) {
    for (const group in this._allPermission) {
      this._allPermission[group] = this._allPermission[group].map((item) => {
        return new PermissionUpdatableTable({
          ...item,
          access: this.getInitAccessByTarget(permission, item.target),
        })
      })
    }
  }

  public toArray() {
    const arrAllPermission = [] as PermissionUpdatableTable[]
    for (const group in this._allPermission) {
      arrAllPermission.push(this._allPermission[group])
    }
    return arrAllPermission
  }

  public toPermissionArray() {
    const arrAllPermission = [] as Permission[]
    for (const group in this._allPermission) {
      arrAllPermission.push(
        ...this._allPermission[group].map((item) => new Permission(item).toJSON())
      )
    }
    return arrAllPermission
  }

  get allPermission() {
    return this._allPermission
  }
}
