import i18n from '@/libs/i18n'
import { UserInfo } from '@model/user'
import { GroupData } from '@model/group'
import { ProjectInfo } from '@model/project'
import { FieldInfo, FieldType } from '@model/field'
import { OptionsItem } from '@/@model'
import { GamesProducersListItem } from '@model/gamesProducers'
import { GamesCategoriesListItem } from '@model/gamesCategories'
import { TransactionType } from '@model/playersTransactions'
import { typesOptions } from '@model/banners'

// Options
const stateOptions: Array<object> = [
  { text: i18n.t('common.yes'), value: true },
  { text: i18n.t('common.no'), value: false },
]

// Filters
const admin = new FieldInfo<UserInfo>({
  type: FieldType.Select,
  key: 'admin',
  label: String(i18n.t('common.admin._')),
  placeholder: String(i18n.t('placeholder.filter.admin')),
  fetchOptionsActionName: 'users/fetchUsersList',
})

const group = new FieldInfo<GroupData>({
  type: FieldType.MultiSelect,
  key: 'group',
  label: String(i18n.t('common.groups.list')),
  placeholder: String(i18n.t('placeholder.filter.group')),
  fetchOptionsActionName: 'groups/fetchGroupsList',
})

const project = new FieldInfo<ProjectInfo>({
  type: FieldType.MultiSelect,
  key: 'project',
  label: String(i18n.t('common.project.list')),
  placeholder: String(i18n.t('placeholder.filter.project')),
  fetchOptionsActionName: 'projects/fetchProjectsList',
})

const bonusStatus = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: 'bonusStatus',
  label: String(i18n.t('common.bonuses.status')),
  placeholder: String(i18n.t('common.bonuses.status')),
  fetchOptionsActionName: 'bonuses/fetchBonusesStatusList',
})

const giftsStatus = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: 'giftsStatus',
  label: String(i18n.t('common.gifts.status')),
  placeholder: String(i18n.t('common.gifts.status')),
  fetchOptionsActionName: 'gifts/fetchGiftsStatusList',
})

const bonusType = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: 'bonusType',
  label: String(i18n.t('common.bonuses.type')),
  placeholder: String(i18n.t('common.bonuses.type')),
  fetchOptionsActionName: 'bonuses/fetchBonusesTypeList',
})
const giftsType = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: 'giftsType',
  label: String(i18n.t('common.gifts.type')),
  placeholder: String(i18n.t('common.gifts.type')),
  fetchOptionsActionName: 'gifts/fetchGiftsTypeList',
})

const status = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: 'status',
  label: String(i18n.t('common.activity')),
  value: true,
  options: [
    { text: i18n.t('userStatuses.active'), value: true },
    { text: i18n.t('userStatuses.inactive'), value: false },
  ],
})

const hidden = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: 'hidden',
  label: String(i18n.t('filters.hidden')),
  value: true,
  options: stateOptions,
})

const action = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: 'action',
  label: String(i18n.t('page.logging.action')),
  placeholder: String(i18n.t('placeholder.filter.action')),
  fetchOptionsActionName: 'logging/fetchLogActions',
})

const bannerStrategy = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: 'bannerStrategy',
  label: String(i18n.t('common.show')),
  placeholder: String(i18n.t('placeholder.filter.bannerStrategy')),
  fetchOptionsActionName: 'banner/fetchBannersStrategy',
})

const bannerTypes = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: 'bannerTypes',
  label: i18n.t('common.type') as string,
  placeholder: i18n.t('placeholder.filter.types') as string,
  options: typesOptions,
})

const entryId = new FieldInfo<string>({
  type: FieldType.Text,
  key: 'entryId',
  label: String(i18n.t('filters.entryId')),
})
const giftId = new FieldInfo<string>({
  type: FieldType.Text,
  key: 'giftId',
  label: String(i18n.t('filters.giftId')),
})

const entityType = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: 'entityType',
  label: String(i18n.t('common.entity')),
  placeholder: String(i18n.t('placeholder.filter.entityType')),
  fetchOptionsActionName: 'logging/fetchLogEntityList',
})

const sumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: 'sumRange',
  label: String(i18n.t('common.sum')),
})
const initialSumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: 'initialSumRange',
  label: String(i18n.t('filters.initialSumRange')),
})
const winBackSumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: 'winBackSumRange',
  label: String(i18n.t('filters.winBackSumRange')),
})
const realSumRange = new FieldInfo({
  type: FieldType.SumRange,
  key: 'realSumRange',
  label: String(i18n.t('filters.realSumRange')),
})
const wagerLimitRange = new FieldInfo({
  type: FieldType.SumRange,
  key: 'wagerLimitRange',
  label: String(i18n.t('filters.wagerLimitRange')),
})

// Games
const gamesType = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: 'gamesType',
  label: String(i18n.t('filters.gameType')),
  placeholder: String(i18n.t('placeholder.filter.gamesType')),
  fetchOptionsActionName: 'games/fetchGamesTypes',
})

const gamesCategories = new FieldInfo<GamesCategoriesListItem>({
  type: FieldType.MultiSelect,
  key: 'gamesCategories',
  label: String(i18n.t('filters.gamesCategories')),
  placeholder: String(i18n.t('placeholder.filter.gamesCategories')),
  fetchOptionsActionName: 'gamesCategories/fetchGamesCategoriesList',
})

const gamesProducers = new FieldInfo<GamesProducersListItem>({
  type: FieldType.MultiSelect,
  key: 'gamesProducers',
  label: String(i18n.t('filters.gamesProducers')),
  placeholder: String(i18n.t('placeholder.filter.gamesProducers')),
  fetchOptionsActionName: 'gamesProducers/fetchGamesProducersList',
})

const gamesRunners = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: 'gamesRunners',
  label: String(i18n.t('filters.runner')),
  placeholder: String(i18n.t('placeholder.filter.gamesRunners')),
  fetchOptionsActionName: 'games/fetchGamesRunners',
})

const gameForBonuses = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: 'gameForBonuses',
  label: String(i18n.t('filters.gameForBonuses')),
  value: true,
  options: stateOptions,
})

const availableWithBonuses = new FieldInfo<boolean>({
  type: FieldType.Radio,
  key: 'availableWithBonuses',
  label: String(i18n.t('filters.availableWithBonuses')),
  value: true,
  options: stateOptions,
})

// Date
const date = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: 'date',
  label: String(i18n.t('common.date')),
})

const dateRangeCreative = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: 'dateRangeCreative',
  label: String(i18n.t('filters.dateRangeCreative')),
})

const dateRangeUpdate = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: 'dateRangeUpdate',
  label: String(i18n.t('filters.dateRangeUpdate')),
})

const dateRangeIssued = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: 'dateRangeIssued',
  label: String(i18n.t('filters.dateRangeIssued')),
})

const dateRangeExpired = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: 'dateRangeExpired',
  label: String(i18n.t('filters.dateRangeExpired')),
})

const dateRangeProcessing = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: 'dateRangeProcessing',
  label: String(i18n.t('filters.dateRangeProcessing')),
})

// Transactions
const transactionsType = new FieldInfo<OptionsItem>({
  type: FieldType.Select,
  key: 'transactionsType',
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
  key: 'transactionsStatuses',
  label: String(i18n.t('common.status')),
  placeholder: String(i18n.t('placeholder.filter.status')),
  fetchOptionsActionName: 'playersTransactions/fetchTransactionsStatuses',
})

const dateRangeActivated = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: 'dateRangeActivated',
  label: String(i18n.t('filters.dateRangeActivated')),
})

const dateRangeUsed = new FieldInfo<string>({
  type: FieldType.DateRange,
  key: 'dateRangeUsed',
  label: String(i18n.t('filters.dateRangeUsed')),
})

const balancesReasons = new FieldInfo<OptionsItem>({
  type: FieldType.MultiSelect,
  key: 'balancesReasons',
  label: String(i18n.t('common.reason')),
  placeholder: String(i18n.t('placeholder.filter.reason')),
  fetchOptionsActionName: 'balance/fetchBalancesReasonsList',
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
  entryId,
  giftId,
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
}
