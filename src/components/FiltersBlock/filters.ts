import { i18n } from '../../plugins/i18n'
import type { GroupData } from '../../@model/group'
import type { ProjectInfo } from '../../@model/project'
import { FilterType } from '../../@model/filter'
import {
  DateBaseField,
  MultiSelectBaseField, NumberRangeBaseField,
  RadioBaseField,
  SelectBaseField,
  TextBaseField,
} from '../../@model/templates/baseField'
import { TransactionType } from '../../@model/enums/playersTransactions'
import type { RadioOption } from '../../@model/templates/baseField/radio'

// Options
const stateOptions: RadioOption[] = [
  { text: i18n.t('common.yes'), value: true },
  { text: i18n.t('common.no'), value: false },
]

// Filters
// ---------------------------------------------------------------------------
// TODO: Text input
const entryId = new TextBaseField({
  key: FilterType.EntryId,
  label: i18n.t('filters.entryId'),
})

const paymentSystem = new TextBaseField({
  key: FilterType.PaymentSystem,
  label: i18n.t('filters.paymentSystem'),
})

const giftId = new TextBaseField({
  key: FilterType.GiftId,
  label: i18n.t('filters.giftId'),
})

const giftName = new TextBaseField({
  key: FilterType.GiftName,
  label: i18n.t('filters.giftName'),
})

const gameId = new TextBaseField({
  key: FilterType.GameId,
  label: i18n.t('filters.gameId'),
})

const demoType = new SelectBaseField({
  key: FilterType.DemoType,
  label: i18n.t('common.type'),
  placeholder: i18n.t('placeholder.filter.type'),
  options: [
    {
      id: TransactionType.Payout,
      name: i18n.t('common.payout'),
    },
    {
      id: TransactionType.Deposit,
      name: i18n.t('common.deposit'),
    },
  ],
})

// ---------------------------------------------------------------------------
// TODO: Select
// const admin = new SelectBaseField<UserInfo>({ // TODO: Uncomment after fix user model
const admin = new SelectBaseField({
  key: FilterType.Admin,
  label: i18n.t('common.admin._'),
  placeholder: i18n.t('placeholder.filter.admin'),
  fetchOptionsActionName: 'users/fetchUsersList',
})

const action = new SelectBaseField({
  key: FilterType.Action,
  label: i18n.t('page.logging.action'),
  placeholder: i18n.t('placeholder.filter.action'),
  fetchOptionsActionName: 'logging/fetchLogActions',
})

const bannerStrategy = new SelectBaseField({
  key: FilterType.BannerStrategy,
  label: i18n.t('common.show'),
  placeholder: i18n.t('placeholder.filter.bannerStrategy'),
  fetchOptionsActionName: 'banner/fetchBannersStrategy',
})

const entityType = new SelectBaseField({
  key: FilterType.EntityType,
  label: i18n.t('common.entity'),
  placeholder: i18n.t('placeholder.filter.entityType'),
  fetchOptionsActionName: 'logging/fetchLogEntityList',
})

// Bonuses
const bonusStatus = new SelectBaseField({
  key: FilterType.BonusStatus,
  label: i18n.t('common.bonuses.status'),
  placeholder: i18n.t('common.bonuses.status'),
  fetchOptionsActionName: 'bonuses/fetchBonusesStatusList',
})

const bonusType = new SelectBaseField({
  key: FilterType.BonusType,
  label: i18n.t('common.bonuses.type'),
  placeholder: i18n.t('common.bonuses.type'),
  fetchOptionsActionName: 'bonuses/fetchBonusesTypeList',
})

// Games
const gamesType = new SelectBaseField({
  key: FilterType.GamesType,
  label: i18n.t('filters.gameType'),
  placeholder: i18n.t('placeholder.filter.gamesType'),
  fetchOptionsActionName: 'games/fetchGamesTypes',
})

const gamesRunners = new SelectBaseField({
  key: FilterType.GamesRunners,
  label: i18n.t('filters.runner'),
  placeholder: i18n.t('placeholder.filter.gamesRunners'),
  fetchOptionsActionName: 'games/fetchGamesRunners',
})

// Gifts
const giftsStatus = new SelectBaseField({
  key: FilterType.GiftsStatus,
  label: i18n.t('common.gifts.status'),
  placeholder: i18n.t('common.gifts.status'),
  fetchOptionsActionName: 'gifts/fetchGiftsStatusList',
})

const giftsType = new SelectBaseField({
  key: FilterType.GiftsType,
  label: i18n.t('common.gifts.type'),
  placeholder: i18n.t('common.gifts.type'),
  fetchOptionsActionName: 'gifts/fetchGiftsTypeList',
})

// Betting history
const bettingHistoryStatus = new SelectBaseField({
  key: FilterType.BettingHistoryStatus,
  label: i18n.t('common.betting.status'),
  placeholder: i18n.t('common.betting.status'),
  fetchOptionsActionName: 'betting/fetchBettingHistoryStatusList',
})

const bettingHistoryType = new SelectBaseField({
  key: FilterType.BettingHistoryType,
  label: i18n.t('common.betting.type'),
  placeholder: i18n.t('common.betting.type'),
  fetchOptionsActionName: 'betting/fetchBettingHistoryTypeList',
})

const bettingHistoryBonusType = new SelectBaseField({
  key: FilterType.BettingHistoryBonusType,
  label: i18n.t('common.betting.bonusType'),
  placeholder: i18n.t('common.betting.bonusType'),
  fetchOptionsActionName: 'betting/fetchBettingHistoryBonusTypeList',
})

const bettingHistoryEventType = new SelectBaseField({
  key: FilterType.BettingHistoryEventType,
  label: i18n.t('common.betting.eventType'),
  placeholder: i18n.t('common.betting.eventType'),
  fetchOptionsActionName: 'betting/fetchBettingHistoryEventTypeList',
})

// ---------------------------------------------------------------------------
// TODO: MultiSelect
const group = new MultiSelectBaseField<GroupData>({
  key: FilterType.Group,
  label: i18n.t('common.groups.list'),
  placeholder: i18n.t('placeholder.filter.group'),
  fetchOptionsActionName: 'groups/fetchGroupsList',
})

const project = new MultiSelectBaseField<ProjectInfo>({
  key: FilterType.Project,
  label: i18n.t('common.project.list'),
  placeholder: i18n.t('placeholder.filter.project'),
  fetchOptionsActionName: 'projects/fetchProjectsList',
})

const gamesProducers = new MultiSelectBaseField({
  key: FilterType.GamesProducers,
  label: i18n.t('filters.gamesProducers'),
  placeholder: i18n.t('placeholder.filter.gamesProducers'),
  fetchOptionsActionName: 'gamesProducers/fetchGamesProducersList',
})

const transactionsStatuses = new MultiSelectBaseField({
  key: FilterType.TransactionsStatuses,
  label: i18n.t('common.status'),
  placeholder: i18n.t('placeholder.filter.status'),
  fetchOptionsActionName: 'playersTransactions/fetchTransactionsStatuses',
})

const balancesReasons = new MultiSelectBaseField({
  key: FilterType.BalancesReasons,
  label: i18n.t('common.reason'),
  placeholder: i18n.t('placeholder.filter.reason'),
  fetchOptionsActionName: 'balance/fetchBalancesReasonsList',
})

const tagNames = new MultiSelectBaseField({
  key: 'tagNames',
  label: i18n.t('common.tags'),
  placeholder: i18n.t('common.tags'),
  fetchOptionsActionName: 'tags/fetchTags',
})

const segments = new MultiSelectBaseField({
  key: FilterType.Segments,
  label: i18n.t('common.segments'),
  placeholder: i18n.t('common.segments'),
  fetchOptionsActionName: 'segments/fetchList',
})

// ---------------------------------------------------------------------------
// TODO: Date
const date = new DateBaseField({
  key: FilterType.Date,
  label: i18n.t('common.date'),
  isRangeMode: true,
  withTime: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeCreative = new DateBaseField({
  key: FilterType.DateRangeCreative,
  label: i18n.t('filters.dateRangeCreative'),
  isRangeMode: true,
  withTime: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeApproved = new DateBaseField({
  key: FilterType.DateRangeApproved,
  label: i18n.t('filters.dateRangeApproved'),
  isRangeMode: true,
  withTime: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeUpdate = new DateBaseField({
  key: FilterType.DateRangeUpdate,
  label: i18n.t('filters.dateRangeUpdate'),
  isRangeMode: true,
  withTime: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeIssued = new DateBaseField({
  key: FilterType.DateRangeIssued,
  label: i18n.t('filters.dateRangeIssued'),
  isRangeMode: true,
  withTime: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeExpired = new DateBaseField({
  key: FilterType.DateRangeExpired,
  label: i18n.t('filters.dateRangeExpired'),
  isRangeMode: true,
  withTime: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeProcessing = new DateBaseField({
  key: FilterType.DateRangeProcessing,
  label: i18n.t('filters.dateRangeProcessing'),
  isRangeMode: true,
  withTime: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeActivated = new DateBaseField({
  key: FilterType.DateRangeActivated,
  label: i18n.t('filters.dateRangeActivated'),
  isRangeMode: true,
  withTime: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeUsed = new DateBaseField({
  key: FilterType.DateRangeUsed,
  label: i18n.t('filters.dateRangeUsed'),
  isRangeMode: true,
  withTime: true,
  validationRules: { range_date: false, range_date_different: false },
})

const bettingDateCreative = new DateBaseField({
  key: FilterType.BettingDateCreative,
  label: i18n.t('filters.bettingDateCreative'),
  isRangeMode: true,
  withTime: true,
  validationRules: { range_date: false, range_date_different: false },
})

// ---------------------------------------------------------------------------
// TODO: Radio
const bettingHistoryIsBonus = new RadioBaseField({
  key: FilterType.BettingHistoryIsBonus,
  label: i18n.t('filters.bettingHistoryIsBonus'),
  value: true,
  options: stateOptions,
})

const status = new RadioBaseField({
  key: FilterType.Status,
  label: i18n.t('common.activity'),
  value: true,
  options: [
    { text: i18n.t('userStatuses.active'), value: true },
    { text: i18n.t('userStatuses.inactive'), value: false },
  ],
})

const hidden = new RadioBaseField({
  key: FilterType.Hidden,
  label: i18n.t('filters.hidden'),
  value: true,
  options: stateOptions,
})

const gameForBonuses = new RadioBaseField({
  key: FilterType.GameForBonuses,
  label: i18n.t('filters.gameForBonuses'),
  value: true,
  options: stateOptions,
})

const availableWithBonuses = new RadioBaseField({
  key: FilterType.AvailableWithBonuses,
  label: i18n.t('filters.availableWithBonuses'),
  value: true,
  options: stateOptions,
})

// ---------------------------------------------------------------------------
// TODO: Sum range
const sumRange = new NumberRangeBaseField({
  key: FilterType.SumRange,
  label: i18n.t('common.sum'),
})

const initialSumRange = new NumberRangeBaseField({
  key: FilterType.InitialSumRange,
  label: i18n.t('filters.initialSumRange'),
})

const winBackSumRange = new NumberRangeBaseField({
  key: FilterType.WinBackSumRange,
  label: i18n.t('filters.winBackSumRange'),
})

const realSumRange = new NumberRangeBaseField({
  key: FilterType.RealSumRange,
  label: i18n.t('filters.realSumRange'),
})

const wagerLimitRange = new NumberRangeBaseField({
  key: FilterType.WagerLimitRange,
  label: i18n.t('filters.wagerLimitRange'),
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
  dateRangeApproved,
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
