import { i18n } from '../../plugins/i18n'
import type { GroupData } from '../../@model/group'
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
import { getEndOfDay } from '../../helpers/date'
import { useUsersStore } from '../../stores/users'

// import { useLoggingStore } from '@/stores/logging'
// import { useSegmentsStore } from '@/stores/segments'
// import { useBonusesStore } from '@/stores/bonuses'
// import { useGamesProducersStore } from '@/stores/games/index'
// import { useGamesStore } from '@/stores/games/producers'
// import { useGiftsStore } from '@/stores/gifts'
// import { useBettingsStore } from '@/stores/bettings'
// import { fetchProjectsList } from '@/stores/projects'
// import { usePlayersTransactionsStore } from '@/stores/player/transaction'
// import { useBalanceStore } from '@/stores/balance'
// import { useTagsStore } from '@/stores/tags'
// import { useGiftsStore } from '@/stores/gifts'

// Options
export const stateOptions: RadioOption[] = [
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
  fetchOptionsAction: () => useUsersStore().fetchUsersList,
})

// const action = new SelectBaseField({
//   key: FilterType.Action,
//   label: i18n.t('page.logging.action'),
//   placeholder: i18n.t('placeholder.filter.action'),
//   fetchOptionsAction: useLoggingStore().fetchLogActions,
// })

// const bannerStrategy = new SelectBaseField({
//   key: FilterType.BannerStrategy,
//   label: i18n.t('common.showTo'),
//   placeholder: i18n.t('placeholder.filter.bannerStrategy'),
//   fetchOptionsAction: useSegmentsStore().fetchSegmentsStrategyList,
// })

// const entityType = new SelectBaseField({
//   key: FilterType.EntityType,
//   label: i18n.t('common.entity'),
//   placeholder: i18n.t('placeholder.filter.entityType'),
//   fetchOptionsAction: useLoggingStore().fetchLogEntityList,
// })

// Bonuses
// const bonusStatus = new SelectBaseField({
//   key: FilterType.BonusStatus,
//   label: i18n.t('common.bonuses.status'),
//   placeholder: i18n.t('common.bonuses.status'),
//   fetchOptionsAction: useBonusesStore().fetchBonusesStatusList,
// })
//
// const bonusType = new SelectBaseField({
//   key: FilterType.BonusType,
//   label: i18n.t('common.bonuses.type'),
//   placeholder: i18n.t('common.bonuses.type'),
//   fetchOptionsAction: useBonusesStore().fetchBonusesTypeList,
// })

// Games
// const gamesType = new MultiSelectBaseField({
//   key: FilterType.GamesType,
//   label: i18n.t('filters.gameType'),
//   placeholder: i18n.t('placeholder.filter.gamesType'),
//   fetchOptionsAction: useGamesStore().fetchGamesTypes,
// })
//
// const gamesRunners = new SelectBaseField({
//   key: FilterType.GamesRunners,
//   label: i18n.t('filters.runner'),
//   placeholder: i18n.t('placeholder.filter.gamesRunners'),
//   fetchOptionsAction: useGamesStore().fetchGamesRunners,
// })
//
// // Gifts
// const giftsStatus = new SelectBaseField({
//   key: FilterType.GiftsStatus,
//   label: i18n.t('common.gifts.status'),
//   placeholder: i18n.t('common.gifts.status'),
//   fetchOptionsAction: useGiftsStore().fetchGiftsStatusList,
// })

// const giftsType = new SelectBaseField({
//   key: FilterType.GiftsType,
//   label: i18n.t('common.gifts.type'),
//   placeholder: i18n.t('common.gifts.type'),
//   fetchOptionsAction: useGiftsStore().fetchGiftsTypeList,
// })
//

// Betting history
// const bettingHistoryStatus = new SelectBaseField({
//   key: FilterType.BettingHistoryStatus,
//   label: i18n.t('common.betting.status'),
//   placeholder: i18n.t('common.betting.status'),
//   fetchOptionsAction: useBettingsStore().fetchBettingHistoryStatusList,
// })

// const bettingHistoryType = new SelectBaseField({
//   key: FilterType.BettingHistoryType,
//   label: i18n.t('common.betting.type'),
//   placeholder: i18n.t('common.betting.type'),
//   etchOptionsAction: useBettingsStore().fetchBettingHistoryTypeList,
// })

// const bettingHistoryBonusType = new SelectBaseField({
//   key: FilterType.BettingHistoryBonusType,
//   label: i18n.t('common.betting.bonusType'),
//   placeholder: i18n.t('common.betting.bonusType'),
//   fetchOptionsAction: useBettingsStore().fetchBettingHistoryTypeList,
// })

// const bettingHistoryEventType = new SelectBaseField({
//   key: FilterType.BettingHistoryEventType,
//   label: i18n.t('common.betting.eventType'),
//   placeholder: i18n.t('common.betting.eventType'),
//   fetchOptionsAction: useBettingsStore().fetchBettingHistoryEventTypeList,
// })

// ---------------------------------------------------------------------------
// TODO: MultiSelect
const group = new MultiSelectBaseField<GroupData>({
  key: FilterType.Group,
  label: i18n.t('common.groups.list'),
  placeholder: i18n.t('placeholder.filter.group'),
  fetchOptionsAction: 'groups/fetchGroupsList',
})

// const project = new MultiSelectBaseField<ProjectInfo>({
//   key: FilterType.Project,
//   label: i18n.t('common.project.list'),
//   placeholder: i18n.t('placeholder.filter.project'),
//   fetchOptionsAction: fetchProjectsList().fetchProjectsList,
// })

// const gamesProducers = new MultiSelectBaseField({
//   key: FilterType.GamesProducers,
//   label: i18n.t('filters.gamesProducers'),
//   placeholder: i18n.t('placeholder.filter.gamesProducers'),
//   fetchOptionsAction: 'gamesProducers/fetchGamesProducersList',
//   fetchOptionsAction: useGamesProducersStore().fetchGamesProducersList,
// })

// const transactionsStatuses = new MultiSelectBaseField({
//   key: FilterType.TransactionsStatuses,
//   label: i18n.t('common.status'),
//   placeholder: i18n.t('placeholder.filter.status'),
//   fetchOptionsAction: usePlayersTransactionsStore().fetchTransactionsStatuses,
// })

// const balancesReasons = new MultiSelectBaseField({
//   key: FilterType.BalancesReasons,
//   label: i18n.t('common.reason'),
//   placeholder: i18n.t('placeholder.filter.reason'),
//   fetchOptionsAction: useBalanceStore().fetchBalancesReasonsList,
// })

// const tagNames = new MultiSelectBaseField({
//   key: 'tagNames',
//   label: i18n.t('common.tags'),
//   placeholder: i18n.t('placeholder.filter.tags'),
//   fetchOptionsAction: useTagsStore().fetchTags,
// })

// const segments = new MultiSelectBaseField({
//   key: FilterType.Segments,
//   label: i18n.t('common.segments'),
//   placeholder: i18n.t('common.segments'),
//   fetchOptionsAction: useSegmentsStore().fetchList,
// })

// ---------------------------------------------------------------------------
// TODO: Date
const date = new DateBaseField({
  key: FilterType.Date,
  label: i18n.t('common.date'),
  isRangeMode: true,
  withTime: true,
  isFilter: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeCreative = new DateBaseField({
  key: FilterType.DateRangeCreative,
  label: i18n.t('filters.dateRangeCreative'),
  isRangeMode: true,
  withTime: true,
  isFilter: true,
  maxDateTo: getEndOfDay(),
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeApproved = new DateBaseField({
  key: FilterType.DateRangeApproved,
  label: i18n.t('filters.dateRangeApproved'),
  isRangeMode: true,
  withTime: true,
  isFilter: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeUpdate = new DateBaseField({
  key: FilterType.DateRangeUpdate,
  label: i18n.t('filters.dateRangeUpdate'),
  isRangeMode: true,
  withTime: true,
  isFilter: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeIssued = new DateBaseField({
  key: FilterType.DateRangeIssued,
  label: i18n.t('filters.dateRangeIssued'),
  isRangeMode: true,
  withTime: true,
  isFilter: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeExpired = new DateBaseField({
  key: FilterType.DateRangeExpired,
  label: i18n.t('filters.dateRangeExpired'),
  isRangeMode: true,
  withTime: true,
  isFilter: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeProcessing = new DateBaseField({
  key: FilterType.DateRangeProcessing,
  label: i18n.t('filters.dateRangeProcessing'),
  isRangeMode: true,
  withTime: true,
  isFilter: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeActivated = new DateBaseField({
  key: FilterType.DateRangeActivated,
  label: i18n.t('filters.dateRangeActivated'),
  isRangeMode: true,
  withTime: true,
  isFilter: true,
  validationRules: { range_date: false, range_date_different: false },
})

const dateRangeUsed = new DateBaseField({
  key: FilterType.DateRangeUsed,
  label: i18n.t('filters.dateRangeUsed'),
  isRangeMode: true,
  withTime: true,
  isFilter: true,
  validationRules: { range_date: false, range_date_different: false },
})

const bettingDateCreative = new DateBaseField({
  key: FilterType.BettingDateCreative,
  label: i18n.t('filters.bettingDateCreative'),
  isRangeMode: true,
  withTime: true,
  isFilter: true,
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
  status,
  hidden,
  paymentSystem,
  entryId,
  giftId,
  giftName,
  sumRange,
  initialSumRange,
  winBackSumRange,
  realSumRange,
  wagerLimitRange,
  demoType,
  gameForBonuses,
  availableWithBonuses,
  date,
  dateRangeCreative,
  dateRangeApproved,
  dateRangeUpdate,
  dateRangeIssued,
  dateRangeExpired,
  dateRangeProcessing,
  dateRangeActivated,
  dateRangeUsed,
  bettingHistoryIsBonus,
  bettingDateCreative,
  gameId,

  // project,
  // bonusStatus,
  // giftsStatus,
  // bonusType,
  // giftsType,
  // bannerStrategy,
  // action,
  // entityType,
  // balancesReasons,
  // Games
  // gamesType,
  // gamesProducers,
  // gamesRunners,
  // Date
  // Transactions
  // transactionsStatuses,
  // tagNames,
  // Betting history
  // bettingHistoryStatus,
  // bettingHistoryEventType,
  // bettingHistoryBonusType,
  // bettingHistoryType,
  // Segments
  // segments,
}
