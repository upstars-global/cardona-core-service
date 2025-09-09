export type PayloadFilters = Record<string, string | string[] | boolean>

export enum FilterType {
  Admin = 'admin',
  Group = 'group',
  Status = 'status',
  Date = 'date',
  PaymentSystem = 'paymentSystem',
  EntryId = 'entryId',
  GameForBonuses = 'gameForBonuses',
  AvailableWithBonuses = 'availableWithBonuses',
  Name = 'name',
  DateRangeCreative = 'dateRangeCreative',
  DateRangeApproved = 'dateRangeApproved',
  DateRangeUpdate = 'dateRangeUpdate',
  DateRangeProcessing = 'dateRangeProcessing',
  Hidden = 'hidden',
  SumRange = 'sumRange',
  GiftId = 'giftId',
  GiftName = 'giftName',
  InitialSumRange = 'initialSumRange',
  WinBackSumRange = 'winBackSumRange',
  RealSumRange = 'realSumRange',
  BettingHistoryIsBonus = 'bettingHistoryIsBonus',
  GameId = 'gameId',
  BettingDateCreative = 'bettingDateCreative',
  WagerLimitRange = 'wagerLimitRange',
  DateRangeIssued = 'dateRangeIssued',
  DateRangeExpired = 'dateRangeExpired',
  DateRangeActivated = 'dateRangeActivated',
  DateRangeUsed = 'dateRangeUsed',
  DemoType = 'demoType',

  // Project = 'project',
  // BannerStrategy = 'bannerStrategy',
  // Action = 'action',
  // EntityType = 'entityType',
  // GamesType = 'gamesType',
  // GamesProducers = 'gamesProducers',
  // GamesRunners = 'gamesRunners',
  // Slug = 'slug',
  // TransactionsStatuses = 'transactionsStatuses',
  // BonusStatus = 'bonusStatus',
  // GiftsStatus = 'giftsStatus',
  // BettingHistoryStatus = 'bettingHistoryStatus',
  // BettingHistoryType = 'bettingHistoryType',
  // BettingHistoryEventType = 'bettingHistoryEventType',
  // BettingHistoryBonusType = 'bettingHistoryBonusType',
  // BonusType = 'bonusType',
  // GiftsType = 'giftsType',
  // BalancesReasons = 'balancesReasons',
  // TagNames = 'tagNames',
  // Segments = 'segments',
}

export class FilterID {
  readonly id: string

  constructor({ id }) {
    this.id = id
  }
}

export class FilterSearch {
  readonly search?: string

  constructor({ search }) {
    this.search = search
  }
}

export class FilterProject {
  readonly project: string

  constructor({ project }) {
    this.project = project
  }
}

export interface IDefaultFilter {
  readonly type: string
  readonly fields: string[]
}
