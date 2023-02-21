export type PermissionUpdatableType = 'switch' | 'table'
export type PermissionLevel = 'noaccess' | 'view' | 'create' | 'update' | 'delete'

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

export type PermissionGroup =
  | 'manageAccess'
  | 'players'
  | 'configurations'
  | 'promo'
  | 'playerData'
  | 'balances'
  | 'playerCommunication'
  | 'notes'
  | 'games'
  | 'gamesCategories'
  | 'gamesProducers'
  | 'staticPages'

export class AllPermission {
  private _allPermission = {
    manageAccess: [
      {
        type: 'table',
        target: 'backoffice-groups',
      },
      {
        type: 'table',
        target: 'backoffice-users',
      },
    ] as PermissionUpdatableTable[],
    gamesCategories: [
      {
        type: 'table',
        target: 'backoffice-games-categories',
      },
      {
        type: 'table',
        target: 'backoffice-games-categories-seo',
        notAccessLevel: [4],
      },
      {
        type: 'switch',
        target: 'backoffice-games-categories-report',
      },
    ] as PermissionUpdatableTable[],
    games: [
      {
        type: 'table',
        target: 'backoffice-games',
      },
      {
        type: 'table',
        target: 'backoffice-games-seo',
        notAccessLevel: [4],
      },
      {
        type: 'switch',
        target: 'backoffice-games-report',
      },
    ] as PermissionUpdatableTable[],
    gamesProducers: [
      {
        type: 'table',
        target: 'backoffice-games-producers',
      },
      {
        type: 'table',
        target: 'backoffice-games-producers-seo',
        notAccessLevel: [4],
      },
      {
        type: 'switch',
        target: 'backoffice-games-producers-report',
      },
    ] as PermissionUpdatableTable[],
    players: [
      {
        type: 'switch',
        target: 'section-support-service',
      },
    ] as PermissionUpdatableTable[],
    configurations: [
      {
        type: 'table',
        target: 'backoffice-projects',
      },
    ] as PermissionUpdatableTable[],
    promo: [
      {
        type: 'table',
        target: 'backoffice-banners',
      },
    ] as PermissionUpdatableTable[],
    staticPages: [
      {
        type: 'table',
        target: 'backoffice-static-pages',
      },
      {
        type: 'table',
        target: 'backoffice-static-pages-seo',
        notAccessLevel: [4],
      },
      {
        type: 'switch',
        target: 'backoffice-static-pages-report',
      },
    ] as PermissionUpdatableTable[],
    playerCard: [
      {
        target: 'field-player-main',
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: 'field-player-status',
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: 'field-player-isblocked',
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: 'field-player-verification',
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: 'field-player-manager',
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: 'field-player-autopayment',
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: 'backoffice-notes',
        type: 'table',
        notAccessLevel: [4],
      },
      {
        target: 'backoffice-notifications-sms',
        type: 'table',
        notAccessLevel: [3, 4],
      },
      {
        target: 'backoffice-notifications-web',
        type: 'table',
      },
      {
        target: 'field-read-balance',
        type: 'table',
        notAccessLevel: [2, 3, 4],
      },
      {
        target: 'backoffice-real-balance-update',
        type: 'switch',
      },
      {
        target: 'backoffice-player-payment-system',
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: 'marbella-cards',
        type: 'table',
        notAccessLevel: [2, 3],
      },
      {
        target: 'backoffice-payment-dailylimits',
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: 'backoffice-transactions',
        type: 'table',
        notAccessLevel: [2, 3, 4],
      },
      {
        target: 'backoffice-players-bonus',
        type: 'table',
        notAccessLevel: [3],
      },
      {
        target: 'backoffice-player-gifts',
        type: 'table',
      },
      {
        target: 'backoffice-payment-balanceslog',
        type: 'table',
        notAccessLevel: [2, 3, 4],
      },
    ] as PermissionUpdatableTable[],
    other: [
      {
        type: 'switch',
        target: 'backoffice-logaction',
      },
    ] as PermissionUpdatableTable[],
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
