import i18n from '../../plugins/i18n'
import type { GroupData } from '../../@model/group'
import type { ProjectInfo } from '../../@model/project'
import { FieldInfo, FieldType } from '../../@model/field'
import type { OptionsItem } from '../../@model'
import { FilterType } from '../../@model/filter'
import {SelectBaseField, TextBaseField} from '../../@model/templates/baseField'
import { TransactionType } from '../../@model/enums/playersTransactions'
// Options
const stateOptions: Array<object> = [
  { text: i18n.global.t('common.yes'), value: true },
  { text: i18n.global.t('common.no'), value: false },
]

// Filters
// ---------------------------------------------------------------------------
// TODO: Text input
const entryId = new TextBaseField({
  key: FilterType.EntryId,
  label: i18n.global.t('filters.entryId'),
})

const paymentSystem = new TextBaseField({
  key: FilterType.PaymentSystem,
  label: i18n.global.t('filters.paymentSystem'),
})

const giftId = new TextBaseField({
  key: FilterType.GiftId,
  label: i18n.global.t('filters.giftId'),
})

const giftName = new TextBaseField({
  key: FilterType.GiftName,
  label: i18n.global.t('filters.giftName'),
})

const gameId = new TextBaseField({
  key: FilterType.GameId,
  label: i18n.global.t('filters.gameId'),
})

const demoType = new SelectBaseField({
  key: FilterType.DemoType,
  label: i18n.global.t('common.type'),
  placeholder: i18n.global.t('placeholder.filter.type'),
  options: [
    {
      id: TransactionType.Payout,
      name: i18n.global.t('common.payout'),
    },
    {
      id: TransactionType.Deposit,
      name: i18n.global.t('common.deposit'),
    },
  ],
})

// ---------------------------------------------------------------------------
// TODO: Select
// const admin = new SelectBaseField<UserInfo>({ // TODO: Uncomment after fix user model
const admin = new SelectBaseField({
  key: FilterType.Admin,
  label: i18n.global.t('common.admin._'),
  placeholder: i18n.global.t('placeholder.filter.admin'),
  fetchOptionsActionName: 'users/fetchUsersList',
})

const action = new SelectBaseField({
  key: FilterType.Action,
  label: i18n.global.t('page.logging.action'),
  placeholder: i18n.global.t('placeholder.filter.action'),
  fetchOptionsActionName: 'logging/fetchLogActions',
})

const bannerStrategy = new SelectBaseField({
  key: FilterType.BannerStrategy,
  label: i18n.global.t('common.show'),
  placeholder: i18n.global.t('placeholder.filter.bannerStrategy'),
  fetchOptionsActionName: 'banner/fetchBannersStrategy',
})

const entityType = new SelectBaseField({
  key: FilterType.EntityType,
  label: i18n.global.t('common.entity'),
  placeholder: i18n.global.t('placeholder.filter.entityType'),
  fetchOptionsActionName: 'logging/fetchLogEntityList',
})

// Bonuses
const bonusStatus = new SelectBaseField({
  key: FilterType.BonusStatus,
  label: i18n.global.t('common.bonuses.status'),
  placeholder: i18n.global.t('common.bonuses.status'),
  fetchOptionsActionName: 'bonuses/fetchBonusesStatusList',
})

const bonusType = new SelectBaseField({
  key: FilterType.BonusType,
  label: i18n.global.t('common.bonuses.type'),
  placeholder: i18n.global.t('common.bonuses.type'),
  fetchOptionsActionName: 'bonuses/fetchBonusesTypeList',
})

// Games
const gamesType = new SelectBaseField({
  key: FilterType.GamesType,
  label: i18n.global.t('filters.gameType'),
  placeholder: i18n.global.t('placeholder.filter.gamesType'),
  fetchOptionsActionName: 'games/fetchGamesTypes',
})

const gamesRunners = new SelectBaseField({
  key: FilterType.GamesRunners,
  label: i18n.global.t('filters.runner'),
  placeholder: i18n.global.t('placeholder.filter.gamesRunners'),
  fetchOptionsActionName: 'games/fetchGamesRunners',
})

// Gifts
const giftsStatus = new SelectBaseField({
  key: FilterType.GiftsStatus,
  label: i18n.global.t('common.gifts.status'),
  placeholder: i18n.global.t('common.gifts.status'),
  fetchOptionsActionName: 'gifts/fetchGiftsStatusList',
})

const giftsType = new SelectBaseField({
  key: FilterType.GiftsType,
  label: i18n.global.t('common.gifts.type'),
  placeholder: i18n.global.t('common.gifts.type'),
  fetchOptionsActionName: 'gifts/fetchGiftsTypeList',
})

// Betting history
const bettingHistoryStatus = new SelectBaseField({
  key: FilterType.BettingHistoryStatus,
  label: i18n.global.t('common.betting.status'),
  placeholder: i18n.global.t('common.betting.status'),
  fetchOptionsActionName: 'betting/fetchBettingHistoryStatusList',
})

const bettingHistoryType = new SelectBaseField({
  key: FilterType.BettingHistoryType,
  label: i18n.global.t('common.betting.type'),
  placeholder: i18n.global.t('common.betting.type'),
  fetchOptionsActionName: 'betting/fetchBettingHistoryTypeList',
})

const bettingHistoryBonusType = new SelectBaseField({
  key: FilterType.BettingHistoryBonusType,
  label: i18n.global.t('common.betting.bonusType'),
  placeholder: i18n.global.t('common.betting.bonusType'),
  fetchOptionsActionName: 'betting/fetchBettingHistoryBonusTypeList',
})

const bettingHistoryEventType = new SelectBaseField({
  key: FilterType.BettingHistoryEventType,
  label: i18n.global.t('common.betting.eventType'),
  placeholder: i18n.global.t('common.betting.eventType'),
  fetchOptionsActionName: 'betting/fetchBettingHistoryEventTypeList',
})

// ---------------------------------------------------------------------------
// TODO: MultiSelect
const group = new FieldInfo<GroupData>({
  type: FieldType.MultiSelect,
  key: FilterType.Group,
  label: i18n.global.t('common.groups.list'),
  placeholder: i18n.global.t('placeholder.filter.group'),
  fetchOptionsActionName: 'groups/fetchGroupsList',
})

const project = new FieldInfo<ProjectInfo>({
  type: FieldType.MultiSelect,
  key: FilterType.Project,
  label: i18n.global.t('common.project.list'),
  placeholder: i18n.global.t('placeholder.filter.project'),
  fetchOptionsActionName: 'projects/fetchProjectsList',
})

const gamesProducers = new FieldInfo({
  type: FieldType.MultiSelect,
  key: FilterType.GamesProducers,
  label: i18n.global.t('filters.gamesProducers'),
  placeholder: i18n.global.t('placeholder.filter.gamesProducers'),
  fetchOptionsActionName: 'gamesProducers/fetchGamesProducersList',
})

const transactionsStatuses = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: FilterType.TransactionsStatuses,
  label: i18n.global.t('common.status'),
  placeholder: i18n.global.t('placeholder.filter.status'),
  fetchOptionsActionName: 'playersTransactions/fetchTransactionsStatuses',
})

const balancesReasons = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: FilterType.BalancesReasons,
  label: i18n.global.t('common.reason'),
  placeholder: i18n.global.t('placeholder.filter.reason'),
  fetchOptionsActionName: 'balance/fetchBalancesReasonsList',
})

const tagNames = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: 'tagNames',
  label: i18n.global.t('common.tags') as string,
  placeholder: i18n.global.t('common.tags') as string,
  fetchOptionsActionName: 'tags/fetchTags',
})

const segments = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: FilterType.Segments,
  label: i18n.global.t('common.segments') as string,
  placeholder: i18n.global.t('common.segments') as string,
  fetchOptionsActionName: 'segments/fetchList',
})

// ---------------------------------------------------------------------------
// TODO: Date
const date = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.Date,
  label: i18n.global.t('common.date'),
})

const dateRangeCreative = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeCreative,
  label: i18n.global.t('filters.dateRangeCreative'),
})

const dateRangeUpdate = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeUpdate,
  label: i18n.global.t('filters.dateRangeUpdate'),
})

const dateRangeIssued = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeIssued,
  label: i18n.global.t('filters.dateRangeIssued'),
})

const dateRangeExpired = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeExpired,
  label: i18n.global.t('filters.dateRangeExpired'),
})

const dateRangeProcessing = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeProcessing,
  label: i18n.global.t('filters.dateRangeProcessing'),
})

const dateRangeActivated = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeActivated,
  label: i18n.global.t('filters.dateRangeActivated'),
})

const dateRangeUsed = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeUsed,
  label: i18n.global.t('filters.dateRangeUsed'),
})

const bettingDateCreative = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.BettingDateCreative,
  label: i18n.global.t('filters.bettingDateCreative'),
})

// ---------------------------------------------------------------------------
// TODO: Radio
const bettingHistoryIsBonus = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.BettingHistoryIsBonus,
  label: i18n.global.t('filters.bettingHistoryIsBonus'),
  value: true,
  options: stateOptions,
})

const status = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.Status,
  label: i18n.global.t('common.activity'),
  value: true,
  options: [
    { text: i18n.global.t('userStatuses.active'), value: true },
    { text: i18n.global.t('userStatuses.inactive'), value: false },
  ],
})

const hidden = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.Hidden,
  label: i18n.global.t('filters.hidden'),
  value: true,
  options: stateOptions,
})

const gameForBonuses = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.GameForBonuses,
  label: i18n.global.t('filters.gameForBonuses'),
  value: true,
  options: stateOptions,
})

const availableWithBonuses = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.AvailableWithBonuses,
  label: i18n.global.t('filters.availableWithBonuses'),
  value: true,
  options: stateOptions,
})

// ---------------------------------------------------------------------------
// TODO: Sum range
const sumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.SumRange,
  label: i18n.global.t('common.sum'),
})

const initialSumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.InitialSumRange,
  label: i18n.global.t('filters.initialSumRange'),
})

const winBackSumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.WinBackSumRange,
  label: i18n.global.t('filters.winBackSumRange'),
})

const realSumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.RealSumRange,
  label: i18n.global.t('filters.realSumRange'),
})

const wagerLimitRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.WagerLimitRange,
  label: i18n.global.t('filters.wagerLimitRange'),
})

export default {
  admin,
  group,
  project,
  bonusStatus,
  giftsStatus,
  bonusType,
  giftsType,
  status,
  hidden,
  bannerStrategy,
  action,
  paymentSystem,
  entryId,
  giftId,
  giftName,
  entityType,
  sumRange,
  initialSumRange,
  winBackSumRange,
  realSumRange,
  wagerLimitRange,
  balancesReasons,
  demoType,

  // Games
  gamesType,
  gamesProducers,
  gamesRunners,
  gameForBonuses,
  availableWithBonuses,

  // Date
  date,
  dateRangeCreative,
  dateRangeUpdate,
  dateRangeIssued,
  dateRangeExpired,
  dateRangeProcessing,

  // Transactions
  transactionsStatuses,
  dateRangeActivated,
  dateRangeUsed,
  tagNames,

  // Betting history
  bettingHistoryStatus,
  bettingHistoryEventType,
  bettingHistoryBonusType,
  bettingHistoryType,
  bettingHistoryIsBonus,
  bettingDateCreative,
  gameId,

  // Segments
  segments,
}
