import { t } from '../../plugins/i18n'
import type { GroupData } from '../../@model/group'
import type { ProjectInfo } from '../../@model/project'
import { FieldInfo, FieldType } from '../../@model/field'
import type { OptionsItem } from '../../@model'
import { FilterType } from '../../@model/filter'
import {SelectBaseField, TextBaseField} from '../../@model/templates/baseField'
import { TransactionType } from '../../@model/enums/playersTransactions'
// Options
const stateOptions: Array<object> = [
  { text: t('common.yes'), value: true },
  { text: t('common.no'), value: false },
]

// Filters
// ---------------------------------------------------------------------------
// TODO: Text input
const entryId = new TextBaseField({
  key: FilterType.EntryId,
  label: t('filters.entryId'),
})

const paymentSystem = new TextBaseField({
  key: FilterType.PaymentSystem,
  label: t('filters.paymentSystem'),
})

const giftId = new TextBaseField({
  key: FilterType.GiftId,
  label: t('filters.giftId'),
})

const giftName = new TextBaseField({
  key: FilterType.GiftName,
  label: t('filters.giftName'),
})

const gameId = new TextBaseField({
  key: FilterType.GameId,
  label: t('filters.gameId'),
})

const demoType = new SelectBaseField({
  key: FilterType.DemoType,
  label: t('common.type'),
  placeholder: t('placeholder.filter.type'),
  options: [
    {
      id: TransactionType.Payout,
      name: t('common.payout'),
    },
    {
      id: TransactionType.Deposit,
      name: t('common.deposit'),
    },
  ],
})

// ---------------------------------------------------------------------------
// TODO: Select
// const admin = new SelectBaseField<UserInfo>({ // TODO: Uncomment after fix user model
const admin = new SelectBaseField({
  key: FilterType.Admin,
  label: t('common.admin._'),
  placeholder: t('placeholder.filter.admin'),
  fetchOptionsActionName: 'users/fetchUsersList',
})

const action = new SelectBaseField({
  key: FilterType.Action,
  label: t('page.logging.action'),
  placeholder: t('placeholder.filter.action'),
  fetchOptionsActionName: 'logging/fetchLogActions',
})

const bannerStrategy = new SelectBaseField({
  key: FilterType.BannerStrategy,
  label: t('common.show'),
  placeholder: t('placeholder.filter.bannerStrategy'),
  fetchOptionsActionName: 'banner/fetchBannersStrategy',
})

const entityType = new SelectBaseField({
  key: FilterType.EntityType,
  label: t('common.entity'),
  placeholder: t('placeholder.filter.entityType'),
  fetchOptionsActionName: 'logging/fetchLogEntityList',
})

// Bonuses
const bonusStatus = new SelectBaseField({
  key: FilterType.BonusStatus,
  label: t('common.bonuses.status'),
  placeholder: t('common.bonuses.status'),
  fetchOptionsActionName: 'bonuses/fetchBonusesStatusList',
})

const bonusType = new SelectBaseField({
  key: FilterType.BonusType,
  label: t('common.bonuses.type'),
  placeholder: t('common.bonuses.type'),
  fetchOptionsActionName: 'bonuses/fetchBonusesTypeList',
})

// Games
const gamesType = new SelectBaseField({
  key: FilterType.GamesType,
  label: t('filters.gameType'),
  placeholder: t('placeholder.filter.gamesType'),
  fetchOptionsActionName: 'games/fetchGamesTypes',
})

const gamesRunners = new SelectBaseField({
  key: FilterType.GamesRunners,
  label: t('filters.runner'),
  placeholder: t('placeholder.filter.gamesRunners'),
  fetchOptionsActionName: 'games/fetchGamesRunners',
})

// Gifts
const giftsStatus = new SelectBaseField({
  key: FilterType.GiftsStatus,
  label: t('common.gifts.status'),
  placeholder: t('common.gifts.status'),
  fetchOptionsActionName: 'gifts/fetchGiftsStatusList',
})

const giftsType = new SelectBaseField({
  key: FilterType.GiftsType,
  label: t('common.gifts.type'),
  placeholder: t('common.gifts.type'),
  fetchOptionsActionName: 'gifts/fetchGiftsTypeList',
})

// Betting history
const bettingHistoryStatus = new SelectBaseField({
  key: FilterType.BettingHistoryStatus,
  label: t('common.betting.status'),
  placeholder: t('common.betting.status'),
  fetchOptionsActionName: 'betting/fetchBettingHistoryStatusList',
})

const bettingHistoryType = new SelectBaseField({
  key: FilterType.BettingHistoryType,
  label: t('common.betting.type'),
  placeholder: t('common.betting.type'),
  fetchOptionsActionName: 'betting/fetchBettingHistoryTypeList',
})

const bettingHistoryBonusType = new SelectBaseField({
  key: FilterType.BettingHistoryBonusType,
  label: t('common.betting.bonusType'),
  placeholder: t('common.betting.bonusType'),
  fetchOptionsActionName: 'betting/fetchBettingHistoryBonusTypeList',
})

const bettingHistoryEventType = new SelectBaseField({
  key: FilterType.BettingHistoryEventType,
  label: t('common.betting.eventType'),
  placeholder: t('common.betting.eventType'),
  fetchOptionsActionName: 'betting/fetchBettingHistoryEventTypeList',
})

// ---------------------------------------------------------------------------
// TODO: MultiSelect
const group = new FieldInfo<GroupData>({
  type: FieldType.MultiSelect,
  key: FilterType.Group,
  label: t('common.groups.list'),
  placeholder: t('placeholder.filter.group'),
  fetchOptionsActionName: 'groups/fetchGroupsList',
})

const project = new FieldInfo<ProjectInfo>({
  type: FieldType.MultiSelect,
  key: FilterType.Project,
  label: t('common.project.list'),
  placeholder: t('placeholder.filter.project'),
  fetchOptionsActionName: 'projects/fetchProjectsList',
})

const gamesProducers = new FieldInfo({
  type: FieldType.MultiSelect,
  key: FilterType.GamesProducers,
  label: t('filters.gamesProducers'),
  placeholder: t('placeholder.filter.gamesProducers'),
  fetchOptionsActionName: 'gamesProducers/fetchGamesProducersList',
})

const transactionsStatuses = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: FilterType.TransactionsStatuses,
  label: t('common.status'),
  placeholder: t('placeholder.filter.status'),
  fetchOptionsActionName: 'playersTransactions/fetchTransactionsStatuses',
})

const balancesReasons = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: FilterType.BalancesReasons,
  label: t('common.reason'),
  placeholder: t('placeholder.filter.reason'),
  fetchOptionsActionName: 'balance/fetchBalancesReasonsList',
})

const tagNames = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: 'tagNames',
  label: t('common.tags') as string,
  placeholder: t('common.tags') as string,
  fetchOptionsActionName: 'tags/fetchTags',
})

const segments = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: FilterType.Segments,
  label: t('common.segments') as string,
  placeholder: t('common.segments') as string,
  fetchOptionsActionName: 'segments/fetchList',
})

// ---------------------------------------------------------------------------
// TODO: Date
const date = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.Date,
  label: t('common.date'),
})

const dateRangeCreative = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeCreative,
  label: t('filters.dateRangeCreative'),
})

const dateRangeUpdate = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeUpdate,
  label: t('filters.dateRangeUpdate'),
})

const dateRangeIssued = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeIssued,
  label: t('filters.dateRangeIssued'),
})

const dateRangeExpired = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeExpired,
  label: t('filters.dateRangeExpired'),
})

const dateRangeProcessing = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeProcessing,
  label: t('filters.dateRangeProcessing'),
})

const dateRangeActivated = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeActivated,
  label: t('filters.dateRangeActivated'),
})

const dateRangeUsed = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeUsed,
  label: t('filters.dateRangeUsed'),
})

const bettingDateCreative = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.BettingDateCreative,
  label: t('filters.bettingDateCreative'),
})

// ---------------------------------------------------------------------------
// TODO: Radio
const bettingHistoryIsBonus = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.BettingHistoryIsBonus,
  label: t('filters.bettingHistoryIsBonus'),
  value: true,
  options: stateOptions,
})

const status = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.Status,
  label: t('common.activity'),
  value: true,
  options: [
    { text: t('userStatuses.active'), value: true },
    { text: t('userStatuses.inactive'), value: false },
  ],
})

const hidden = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.Hidden,
  label: t('filters.hidden'),
  value: true,
  options: stateOptions,
})

const gameForBonuses = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.GameForBonuses,
  label: t('filters.gameForBonuses'),
  value: true,
  options: stateOptions,
})

const availableWithBonuses = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.AvailableWithBonuses,
  label: t('filters.availableWithBonuses'),
  value: true,
  options: stateOptions,
})

// ---------------------------------------------------------------------------
// TODO: Sum range
const sumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.SumRange,
  label: t('common.sum'),
})

const initialSumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.InitialSumRange,
  label: t('filters.initialSumRange'),
})

const winBackSumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.WinBackSumRange,
  label: t('filters.winBackSumRange'),
})

const realSumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.RealSumRange,
  label: t('filters.realSumRange'),
})

const wagerLimitRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.WagerLimitRange,
  label: t('filters.wagerLimitRange'),
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
