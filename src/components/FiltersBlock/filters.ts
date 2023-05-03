import i18n from '../../libs/i18n'
import { UserInfo } from '../../@model/user'
import { GroupData } from '../../@model/group'
import { ProjectInfo } from '../../@model/project'
import { FieldInfo, FieldType } from '../../@model/field'
import { OptionsItem } from '../../@model'
import { GamesProducersListItem } from '../../@model/gamesProducers'
import { GamesCategoriesListItem } from '../../@model/gamesCategories'
import { TransactionType } from '../../@model/playersTransactions'
import { typesOptions } from '../../@model/banners'
import { FilterType } from '../../@model/filter'

// Options
const stateOptions: Array<object> = [
  { text: i18n.t('common.yes'), value: true },
  { text: i18n.t('common.no'), value: false },
]

// Filters
const admin = new FieldInfo<UserInfo>({
  type: FieldType.Select,
  key: FilterType.Admin,
  label: String(i18n.t('common.admin._')),
  placeholder: String(i18n.t('placeholder.filter.admin')),
  fetchOptionsActionName: 'users/fetchUsersList',
})

const group = new FieldInfo<GroupData>({
  type: FieldType.MultiSelect,
  key: FilterType.Group,
  label: String(i18n.t('common.groups.list')),
  placeholder: String(i18n.t('placeholder.filter.group')),
  fetchOptionsActionName: 'groups/fetchGroupsList',
})

const project = new FieldInfo<ProjectInfo>({
  type: FieldType.MultiSelect,
  key: FilterType.Project,
  label: String(i18n.t('common.project.list')),
  placeholder: String(i18n.t('placeholder.filter.project')),
  fetchOptionsActionName: 'projects/fetchProjectsList',
})

const bonusStatus = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.BonusStatus,
  label: String(i18n.t('common.bonuses.status')),
  placeholder: String(i18n.t('common.bonuses.status')),
  fetchOptionsActionName: 'bonuses/fetchBonusesStatusList',
})

const giftsStatus = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.GiftsStatus,
  label: String(i18n.t('common.gifts.status')),
  placeholder: String(i18n.t('common.gifts.status')),
  fetchOptionsActionName: 'gifts/fetchGiftsStatusList',
})

const bonusType = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.BonusType,
  label: String(i18n.t('common.bonuses.type')),
  placeholder: String(i18n.t('common.bonuses.type')),
  fetchOptionsActionName: 'bonuses/fetchBonusesTypeList',
})
const giftsType = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.GiftsType,
  label: String(i18n.t('common.gifts.type')),
  placeholder: String(i18n.t('common.gifts.type')),
  fetchOptionsActionName: 'gifts/fetchGiftsTypeList',
})

const status = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.Status,
  label: String(i18n.t('common.activity')),
  value: true,
  options: [
    { text: i18n.t('userStatuses.active'), value: true },
    { text: i18n.t('userStatuses.inactive'), value: false },
  ],
})

const hidden = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.Hidden,
  label: String(i18n.t('filters.hidden')),
  value: true,
  options: stateOptions,
})

const action = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.Action,
  label: String(i18n.t('page.logging.action')),
  placeholder: String(i18n.t('placeholder.filter.action')),
  fetchOptionsActionName: 'logging/fetchLogActions',
})

const bannerStrategy = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.BannerStrategy,
  label: String(i18n.t('common.show')),
  placeholder: String(i18n.t('placeholder.filter.bannerStrategy')),
  fetchOptionsActionName: 'banner/fetchBannersStrategy',
})

const bannerTypes = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: FilterType.BannerTypes,
  label: i18n.t('common.type') as string,
  placeholder: i18n.t('placeholder.filter.types') as string,
  options: typesOptions,
})

const paymentSystem = new FieldInfo<string>({
  type: FieldType.Text,
  key: FilterType.PaymentSystem,
  label: String(i18n.t('filters.paymentSystem')),
})
const entryId = new FieldInfo<string>({
  type: FieldType.Text,
  key: FilterType.EntryId,
  label: String(i18n.t('filters.entryId')),
})
const giftId = new FieldInfo<string>({
  type: FieldType.Text,
  key: FilterType.GiftId,
  label: String(i18n.t('filters.giftId')),
})
const giftName = new FieldInfo<string>({
  type: FieldType.Text,
  key: FilterType.GiftName,
  label: String(i18n.t('filters.giftName')),
})

const entityType = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.EntityType,
  label: String(i18n.t('common.entity')),
  placeholder: String(i18n.t('placeholder.filter.entityType')),
  fetchOptionsActionName: 'logging/fetchLogEntityList',
})

const sumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.SumRange,
  label: String(i18n.t('common.sum')),
})
const initialSumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.InitialSumRange,
  label: String(i18n.t('filters.initialSumRange')),
})
const winBackSumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.WinBackSumRange,
  label: String(i18n.t('filters.winBackSumRange')),
})
const realSumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.RealSumRange,
  label: String(i18n.t('filters.realSumRange')),
})
const wagerLimitRange = new FieldInfo({
  type: FieldType.SumRange,
  key: FilterType.WagerLimitRange,
  label: String(i18n.t('filters.wagerLimitRange')),
})

// Games
const gamesType = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.GamesType,
  label: String(i18n.t('filters.gameType')),
  placeholder: String(i18n.t('placeholder.filter.gamesType')),
  fetchOptionsActionName: 'games/fetchGamesTypes',
})

const gamesCategories = new FieldInfo<GamesCategoriesListItem>({
  type: FieldType.MultiSelect,
  key: FilterType.GamesCategories,
  label: String(i18n.t('filters.gamesCategories')),
  placeholder: String(i18n.t('placeholder.filter.gamesCategories')),
  fetchOptionsActionName: 'gamesCategories/fetchGamesCategoriesList',
})

const gamesProducers = new FieldInfo<GamesProducersListItem>({
  type: FieldType.MultiSelect,
  key: FilterType.GamesProducers,
  label: String(i18n.t('filters.gamesProducers')),
  placeholder: String(i18n.t('placeholder.filter.gamesProducers')),
  fetchOptionsActionName: 'gamesProducers/fetchGamesProducersList',
})

const gamesRunners = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.GamesRunners,
  label: String(i18n.t('filters.runner')),
  placeholder: String(i18n.t('placeholder.filter.gamesRunners')),
  fetchOptionsActionName: 'games/fetchGamesRunners',
})

const gameForBonuses = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.GameForBonuses,
  label: String(i18n.t('filters.gameForBonuses')),
  value: true,
  options: stateOptions,
})

const availableWithBonuses = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.AvailableWithBonuses,
  label: String(i18n.t('filters.availableWithBonuses')),
  value: true,
  options: stateOptions,
})

// Date
const date = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.Date,
  label: String(i18n.t('common.date')),
})

const dateRangeCreative = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeCreative,
  label: String(i18n.t('filters.dateRangeCreative')),
})

const dateRangeUpdate = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeUpdate,
  label: String(i18n.t('filters.dateRangeUpdate')),
})

const dateRangeIssued = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeIssued,
  label: String(i18n.t('filters.dateRangeIssued')),
})

const dateRangeExpired = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeExpired,
  label: String(i18n.t('filters.dateRangeExpired')),
})

const dateRangeProcessing = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeProcessing,
  label: String(i18n.t('filters.dateRangeProcessing')),
})

// Transactions
const transactionsType = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.TransactionsType,
  label: String(i18n.t('common.type')),
  placeholder: String(i18n.t('placeholder.filter.type')),
  options: [
    {
      id: TransactionType.Payout,
      name: i18n.t(`common.payout`),
    },
    {
      id: TransactionType.Deposit,
      name: i18n.t(`common.deposit`),
    },
  ],
})

const transactionsStatuses = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: FilterType.TransactionsStatuses,
  label: String(i18n.t('common.status')),
  placeholder: String(i18n.t('placeholder.filter.status')),
  fetchOptionsActionName: 'playersTransactions/fetchTransactionsStatuses',
})

const dateRangeActivated = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeActivated,
  label: String(i18n.t('filters.dateRangeActivated')),
})

const dateRangeUsed = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.DateRangeUsed,
  label: String(i18n.t('filters.dateRangeUsed')),
})

const balancesReasons = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: FilterType.BalancesReasons,
  label: String(i18n.t('common.reason')),
  placeholder: String(i18n.t('placeholder.filter.reason')),
  fetchOptionsActionName: 'balance/fetchBalancesReasonsList',
})

const tagNames = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: 'tagNames',
  label: i18n.t('common.tags') as string,
  placeholder: i18n.t('common.tags') as string,
  fetchOptionsActionName: 'tags/fetchTags',
})

//Betting history
const bettingHistoryStatus = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.BettingHistoryStatus,
  label: String(i18n.t('common.betting.status')),
  placeholder: String(i18n.t('common.betting.status')),
  fetchOptionsActionName: 'betting/fetchBettingHistoryStatusList',
})

const bettingHistoryType = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.BettingHistoryType,
  label: String(i18n.t('common.betting.type')),
  placeholder: String(i18n.t('common.betting.type')),
  fetchOptionsActionName: 'betting/fetchBettingHistoryTypeList',
})

const bettingHistoryBonusType = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.BettingHistoryBonusType,
  label: String(i18n.t('common.betting.bonusType')),
  placeholder: String(i18n.t('common.betting.bonusType')),
  fetchOptionsActionName: 'betting/fetchBettingHistoryBonusTypeList',
})

const bettingHistoryEventType = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: FilterType.BettingHistoryEventType,
  label: String(i18n.t('common.betting.eventType')),
  placeholder: String(i18n.t('common.betting.eventType')),
  fetchOptionsActionName: 'betting/fetchBettingHistoryEventTypeList',
})

const bettingHistoryIsBonus = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: FilterType.BettingHistoryIsBonus,
  label: String(i18n.t('filters.bettingHistoryIsBonus')),
  value: true,
  options: stateOptions,
})

const bettingDateCreative = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: FilterType.BettingDateCreative,
  label: String(i18n.t('filters.bettingDateCreative')),
})

const gameId = new FieldInfo<string>({
  type: FieldType.Text,
  key: FilterType.GameId,
  label: String(i18n.t('filters.gameId')),
})

//Segments
const segments = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: FilterType.Segments,
  label: i18n.t('common.segments') as string,
  placeholder: i18n.t('common.segments') as string,
  fetchOptionsActionName: 'segments/fetchList',
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
  bannerTypes,
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

  // Games
  gamesType,
  gamesCategories,
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
  transactionsType,
  transactionsStatuses,
  dateRangeActivated,
  dateRangeUsed,
  tagNames,

  //Betting history
  bettingHistoryStatus,
  bettingHistoryEventType,
  bettingHistoryBonusType,
  bettingHistoryType,
  bettingHistoryIsBonus,
  bettingDateCreative,
  gameId,

  //Segments
  segments,
}
