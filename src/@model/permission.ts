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

export enum PermissionGroup {
  manageAccess = 'manageAccess',
  players = 'players',
  configurations = 'configurations',
  promo = 'promo',
  playerData = 'playerData',
  balances = 'balances',
  playerCommunication = 'playerCommunication',
  notes = 'notes',
  games = 'games',
  gamesCategories = 'gamesCategories',
  gamesProducers = 'gamesProducers',
  staticPages = 'staticPages',
}
export enum PermissionType {
  BackofficGroups = 'backoffice-groups',
  BackofficeUsers = 'backoffice-users',
  BackofficeUsersControl = 'backoffice-users-control',
  BackofficeGamesCategories = 'backoffice-games-categories',
  BackofficeGamesCategoriesSeo = 'backoffice-games-categories-seo',
  BackofficeGamesCategoriesReport = 'backoffice-games-categories-report',
  BackofficeGames = 'backoffice-games',
  BackofficeGamesSeo = 'backoffice-games-seo',
  BackofficeGamesReport = 'backoffice-games-report',
  BackofficeGamesProducers = 'backoffice-games-producers',
  BackofficeGamesProducersSeo = 'backoffice-games-producers-seo',
  BackofficeGamesProducersReport = 'backoffice-games-producers-report',
  SectionSupportService = 'section-support-service',
  BackofficeProjects = 'backoffice-projects',
  BackofficeBanners = 'backoffice-banners',
  BackofficeStaticPages = 'backoffice-static-pages',
  BackofficeStaticPagesSeo = 'backoffice-static-pages-seo',
  BackofficeStaticPagesReport = 'backoffice-static-pages-report',
  FieldPlayerMain = 'field-player-main',
  FieldPlayerStatus = 'field-player-status',
  FieldPlayerIsblocked = 'field-player-isblocked',
  FieldPlayerVerification = 'field-player-verification',
  FieldPlayerManager = 'field-player-manager',
  FieldPlayerAutopayment = 'field-player-autopayment',
  BackofficeNotes = 'backoffice-notes',
  BackofficeNotificationsSms = 'backoffice-notifications-sms',
  BackofficeNotificationsWeb = 'backoffice-notifications-web',
  FieldReadBalance = 'field-read-balance',
  BackofficeRealBalanceUpdate = 'backoffice-real-balance-update',
  BackofficePlayerPaymentSystem = 'backoffice-player-payment-system',
  MarbellaCards = 'marbella-cards',
  BackofficePaymentDailylimits = 'backoffice-payment-dailylimits',
  BackofficeTransactions = 'backoffice-transactions',
  BackofficePlayersBonus = 'backoffice-players-bonus',
  BackofficePlayerGifts = 'backoffice-player-gifts',
  BackofficePaymentBalanceslog = 'backoffice-payment-balanceslog',
  BettingHistory = 'backoffice-betting-history',
  Multiaccounts = 'backoffice-player-multiaccounts',
  BackofficeLogaction = 'backoffice-logaction',
  TreasuryTransactionsChecks = 'backoffice-treasury-transactions-checks',

  JsonapiUsers = 'jsonapi-users',
  JsonapiGroups = 'jsonapi-groups',

  AlaroBackofficeDistributors = 'alaro-backoffice-distributors',
  AlaroBackofficeDistributorsReport = 'alaro-backoffice-distributors-report',

  AlaroBackofficeConnections = 'alaro-backoffice-connections',
  AlaroBackofficeConnectionsBrands = 'alaro-backoffice-connections-brands',
  AlaroBackofficeConnectionsGames = 'alaro-backoffice-connections-games',
  AlaroBackofficeConnectionsReport = 'alaro-backoffice-connections-report',

  AlaroBackofficeOrganizations = 'alaro-backoffice-organizations',
  AlaroBackofficeOrganizationsReport = 'alaro-backoffice-organizations-report',

  AlaroBackofficeBrands = 'alaro-backoffice-brands',
  AlaroBackofficeBrandsConnections = 'alaro-backoffice-brands-connections',
  AlaroBackofficeBrandsGames = 'alaro-backoffice-brands-games',
  AlaroBackofficeBrandsReport = 'alaro-backoffice-brands-report',

  AlaroBackofficeGamecatalog = 'alaro-backoffice-gamecatalog',
  AlaroBackofficeGamecatalogReport = 'alaro-backoffice-gamecatalog-report',

  AlaroBackofficeGameactivity = 'alaro-backoffice-gameactivity',
  AlaroBackofficeGameactivityReport = 'alaro-backoffice-gameactivity-report',

  AlaroBackofficeRoundhistory = 'alaro-backoffice-roundhistory',
  AlaroBackofficeRoundhistoryReport = 'alaro-backoffice-roundhistory-report',

  AlaroBackofficeBonuses = 'alaro-backoffice-bonuses',
  AlaroBackofficeBonusesReports = 'alaro-backoffice-bonuses-reports',
}

export enum PermissionFormType {
  Switch = 'switch',
  Table = 'table',
}

export class AllPermission {
  private _allPermission = {
    manageAccess: [
      {
        type: 'table',
        target: PermissionType.BackofficGroups,
      },
      {
        type: 'table',
        target: PermissionType.BackofficeUsers,
      },
    ] as PermissionUpdatableTable[],
    gamesCategories: [
      {
        type: 'table',
        target: PermissionType.BackofficeGamesCategories,
      },
      {
        type: 'table',
        target: PermissionType.BackofficeGamesCategoriesSeo,
        notAccessLevel: [4],
      },
      {
        type: 'switch',
        target: PermissionType.BackofficeGamesCategoriesReport,
      },
    ] as PermissionUpdatableTable[],
    games: [
      {
        type: 'table',
        target: PermissionType.BackofficeGames,
      },
      {
        type: 'table',
        target: PermissionType.BackofficeGamesSeo,
        notAccessLevel: [4],
      },
      {
        type: 'switch',
        target: PermissionType.BackofficeGamesReport,
      },
    ] as PermissionUpdatableTable[],
    gamesProducers: [
      {
        type: 'table',
        target: PermissionType.BackofficeGamesProducers,
      },
      {
        type: 'table',
        target: PermissionType.BackofficeGamesProducersSeo,
        notAccessLevel: [4],
      },
      {
        type: 'switch',
        target: PermissionType.BackofficeGamesProducersReport,
      },
    ] as PermissionUpdatableTable[],
    players: [
      {
        type: 'switch',
        target: PermissionType.SectionSupportService,
      },
    ] as PermissionUpdatableTable[],
    configurations: [
      {
        type: 'table',
        target: PermissionType.BackofficeProjects,
      },
    ] as PermissionUpdatableTable[],
    promo: [
      {
        type: 'table',
        target: PermissionType.BackofficeBanners,
      },
    ] as PermissionUpdatableTable[],
    staticPages: [
      {
        type: 'table',
        target: PermissionType.BackofficeStaticPages,
      },
      {
        type: 'table',
        target: PermissionType.BackofficeStaticPagesSeo,
        notAccessLevel: [4],
      },
      {
        type: 'switch',
        target: PermissionType.BackofficeStaticPagesReport,
      },
    ] as PermissionUpdatableTable[],
    playerCard: [
      {
        target: PermissionType.FieldPlayerMain,
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: PermissionType.FieldPlayerStatus,
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: PermissionType.FieldPlayerIsblocked,
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: PermissionType.FieldPlayerVerification,
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: PermissionType.FieldPlayerManager,
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: PermissionType.FieldPlayerAutopayment,
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: PermissionType.BackofficeNotes,
        type: 'table',
        notAccessLevel: [4],
      },
      {
        target: PermissionType.BackofficeNotificationsSms,
        type: 'table',
        notAccessLevel: [3, 4],
      },
      {
        target: PermissionType.BackofficeNotificationsWeb,
        type: 'table',
      },
      {
        target: PermissionType.FieldReadBalance,
        type: 'table',
        notAccessLevel: [2, 3, 4],
      },
      {
        target: PermissionType.BackofficeRealBalanceUpdate,
        type: 'switch',
      },
      {
        target: PermissionType.BackofficePlayerPaymentSystem,
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: PermissionType.MarbellaCards,
        type: 'table',
        notAccessLevel: [2, 3],
      },
      {
        target: PermissionType.BackofficePaymentDailylimits,
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: PermissionType.BackofficeTransactions,
        type: 'table',
        notAccessLevel: [2, 3, 4],
      },
      {
        target: PermissionType.BackofficePlayersBonus,
        type: 'table',
        notAccessLevel: [3],
      },
      {
        target: PermissionType.BackofficePlayerGifts,
        type: 'table',
      },
      {
        target: PermissionType.BackofficePaymentBalanceslog,
        type: 'table',
        notAccessLevel: [2, 3, 4],
      },
      {
        target: PermissionType.BettingHistory,
        type: 'table',
        notAccessLevel: [2, 3, 4],
      },
      {
        target: PermissionType.Multiaccounts,
        type: 'table',
        notAccessLevel: [2, 4],
      },
      {
        target: PermissionType.TreasuryTransactionsChecks,
        type: 'table',
        notAccessLevel: [4],
      },
    ] as PermissionUpdatableTable[],
    other: [
      {
        type: 'switch',
        target: PermissionType.BackofficeLogaction,
      },
    ] as PermissionUpdatableTable[],

    configurationsDistributors: [
      {
        type: PermissionFormType.Table,
        target: PermissionType.AlaroBackofficeDistributors,
      },
      {
        type: PermissionFormType.Switch,
        target: PermissionType.AlaroBackofficeDistributorsReport,
      },
    ] as PermissionUpdatableTable[],
    configurationsConnections: [
      {
        type: PermissionFormType.Table,
        target: PermissionType.AlaroBackofficeConnections,
      },
      {
        type: PermissionFormType.Table,
        target: PermissionType.AlaroBackofficeConnectionsBrands,
      },
      {
        type: PermissionFormType.Table,
        target: PermissionType.AlaroBackofficeConnectionsGames,
      },
      {
        type: PermissionFormType.Switch,
        target: PermissionType.AlaroBackofficeDistributorsReport,
      },
    ] as PermissionUpdatableTable[],
    configurationsOrganizations: [
      {
        type: PermissionFormType.Table,
        target: PermissionType.AlaroBackofficeOrganizations,
      },
      {
        type: PermissionFormType.Switch,
        target: PermissionType.AlaroBackofficeOrganizationsReport,
      },
    ] as PermissionUpdatableTable[],

    configurationsBrands: [
      {
        type: PermissionFormType.Table,
        target: PermissionType.AlaroBackofficeBrands,
      },
      {
        type: PermissionFormType.Table,
        target: PermissionType.AlaroBackofficeBrandsConnections,
      },
      {
        type: PermissionFormType.Table,
        target: PermissionType.AlaroBackofficeBrandsGames,
      },
      {
        type: PermissionFormType.Switch,
        target: PermissionType.AlaroBackofficeBrandsReport,
      },
    ] as PermissionUpdatableTable[],
    gamesCatalog: [
      {
        type: PermissionFormType.Table,
        target: PermissionType.AlaroBackofficeGamecatalog,
      },
      {
        type: PermissionFormType.Switch,
        target: PermissionType.AlaroBackofficeGamecatalogReport,
      },
    ] as PermissionUpdatableTable[],

    reportsGames: [
      {
        type: PermissionFormType.Table,
        target: PermissionType.AlaroBackofficeGameactivity,
      },
      {
        type: PermissionFormType.Switch,
        target: PermissionType.AlaroBackofficeGameactivityReport,
      },
    ] as PermissionUpdatableTable[],
    reportsRoundHistory: [
      {
        type: PermissionFormType.Table,
        target: PermissionType.AlaroBackofficeRoundhistory,
      },
      {
        type: PermissionFormType.Switch,
        target: PermissionType.AlaroBackofficeRoundhistoryReport,
      },
    ] as PermissionUpdatableTable[],
    reportsBonuses: [
      {
        type: PermissionFormType.Table,
        target: PermissionType.AlaroBackofficeBonuses,
      },
      {
        type: PermissionFormType.Switch,
        target: PermissionType.AlaroBackofficeBonusesReports,
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
