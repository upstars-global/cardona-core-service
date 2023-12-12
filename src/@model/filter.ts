export type PayloadFilters = Record<string, string | string[] | boolean>

export enum FilterType {
  Admin = 'admin',
  Group = 'group',
  Project = 'project',
  Status = 'status',
  BannerStrategy = 'bannerStrategy',
  Date = 'date',
  Action = 'action',
  PaymentSystem = 'paymentSystem',
  EntryId = 'entryId',
  EntityType = 'entityType',
  GamesType = 'gamesType',
  GamesProducers = 'gamesProducers',
  GamesRunners = 'gamesRunners',
  GameForBonuses = 'gameForBonuses',
  AvailableWithBonuses = 'availableWithBonuses',
  Slug = 'slug',
  Name = 'name',
  DateRangeCreative = 'dateRangeCreative',
  DateRangeUpdate = 'dateRangeUpdate',
  DateRangeProcessing = 'dateRangeProcessing',
  Hidden = 'hidden',
  SumRange = 'sumRange',
  TransactionsStatuses = 'transactionsStatuses',
  GiftId = 'giftId',
  GiftName = 'giftName',
  InitialSumRange = 'initialSumRange',
  WinBackSumRange = 'winBackSumRange',
  RealSumRange = 'realSumRange',
  BonusStatus = 'bonusStatus',
  GiftsStatus = 'giftsStatus',
  BettingHistoryStatus = 'bettingHistoryStatus',
  BettingHistoryIsBonus = 'bettingHistoryIsBonus',
  BettingHistoryType = 'bettingHistoryType',
  BettingHistoryEventType = 'bettingHistoryEventType',
  BettingHistoryBonusType = 'bettingHistoryBonusType',
  BettingDateCreative = 'bettingDateCreative',
  GameId = 'gameId',
  BonusType = 'bonusType',
  GiftsType = 'giftsType',
  WagerLimitRange = 'wagerLimitRange',
  DateRangeIssued = 'dateRangeIssued',
  DateRangeExpired = 'dateRangeExpired',
  DateRangeActivated = 'dateRangeActivated',
  DateRangeUsed = 'dateRangeUsed',
  BalancesReasons = 'balancesReasons',
  TagNames = 'tagNames',
  Segments = 'segments',
  DemoType = 'demoType',
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
