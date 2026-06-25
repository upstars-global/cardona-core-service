import { has } from 'lodash'
import type { TranslationForm } from '../@model/translations'
import type { OptionsItem } from '../@model/index'
import { getShortString } from '../helpers'
import { i18n } from '../plugins/i18n'

export interface IGiftPayload {
  readonly id: string
  readonly title: string
  readonly templateTitle: string
  readonly depositLimits: CurrencyLimit[]
}

export const GIFT_TYPE_OPTIONS = [
  {
    id: 'gift',
    name: i18n.t('component.variableGiftPreset.gift'),
    permission: 'backoffice-gifts',
  },
  {
    id: 'giftSpinOffers',
    name: i18n.t('component.variableGiftPreset.giftSpinOffers'),
    permission: 'alaro-gift-spin-template',
  },
]

export const getOptionTitle = (id: string, title: string) => `${title} (ID ${getShortString(id)})`

export class GiftOptionsItem implements OptionsItem {
  readonly id: string
  readonly name: string
  readonly depositLimits: CurrencyLimit[]

  constructor(data: IGiftPayload) {
    this.id = data.id
    this.name = getOptionTitle(data.id, data.templateTitle || data.title)
    this.depositLimits = data.depositLimits
  }
}

export class GiftSpinOfferOptionsItem implements OptionsItem {
  readonly id: string
  readonly name: string
  readonly rates: CurrencyLimit[]

  constructor(data: { id: string; name: string; rates: { currency: string; bet: number }[] }) {
    this.id = data.id
    this.name = getOptionTitle(data.id, data.name)
    this.rates = data.rates.map(({ currency, bet }) => ({ currency, value: bet }))
  }
}

export const GIFT_SPIN_OFFER_OPTIONS = [
  {
    id: 'rates',
    name: i18n.t('component.variableGiftPreset.fields.rates'),
  },
]

export interface CurrencyLimit {
  currency: string
  value: number
}

export interface IGiftData {
  readonly id: string
  readonly type: string
  readonly title: string
  readonly templateTitle: string
  readonly offerTitle: string
  readonly slug: string
  readonly shortDescription: string
  readonly description: string
  readonly imageUrl: string
  readonly expired: string
  readonly plannedReceiveDateAt: string
  readonly restriction: {
    readonly depositLimits: Array<CurrencyLimit>
    readonly multiAccountBlock: boolean
    readonly needsValidEmail: boolean
    readonly needsValidPhone: boolean
    readonly paymentMethods: string
  }
  readonly autoActivation: boolean
  readonly depositNumber: number
  readonly restrictedCountries: Array<string>
  readonly isActive: boolean
  readonly sums: Array<CurrencyLimit>
  readonly sumLimits: Array<CurrencyLimit>
  readonly multiplier: number
  readonly manualBonus: boolean
  readonly winLimits: Array<CurrencyLimit>
  readonly winLimitsAsPercent: boolean
  readonly period: number
  readonly alaroTemplateId: string
  readonly alaroPromoType: string
  readonly gameId: string
  readonly amount: number
  readonly minWageringOdd: number
  readonly maxWageringOdd: number
  readonly minTotalOdd: number
  readonly maxTotalOdd: number
  readonly allowedBetTypeId: number
  readonly bonusEventTypeId: number
  readonly isCashoutAllowed: boolean
  readonly isBonusAbuse: boolean

  readonly userBonusExpressOddTypeId: number
  readonly userBonusTypeId: number
  readonly giftIds: Array<string>
  readonly fieldTranslations: TranslationForm
  readonly localisationParameters?: object
  readonly wager: number
  readonly giftWager: number
  readonly sumsAsPercent: boolean
  readonly oneTimeBet: boolean
  readonly minNumbOfSelections: number
  readonly allowClientCancellation: boolean
  readonly currencyId: string
  readonly sum: number
  readonly nonDeposit: boolean
  usedInAchievements: Record<string, string>
  usedInActions: Record<string, string>
  usedInTournamentTemplates: Record<string, string>
  usedInTournaments: Record<string, string>

  // TODO rollback after include valid API make like in changes from task https://upstars.atlassian.net/browse/BAC-6306
  // readonly reward: boolean
  // readonly pointsType: string
  // readonly amountOfExperience: number
}

export enum GiftType {
  Cash = 'Cash',
  CustomGift = 'Custom Gift',
  ActionCurrency = 'Action currency',
  DepositBonus = 'Deposit bonus',
  DepositInsurance = 'Deposit insurance',
  Cashback = 'Cashback',
  Group = 'Group',
  NonDeposit = 'NonDeposit',
  XP = 'XP',
  'XP & SP' = 'XP & SP',
  UniversalGaming = 'Universal gaming',
  Betting = 'Betting',
}

const TYPE_GROUP_1 = [
  GiftType.DepositBonus,
  GiftType.ActionCurrency,
  GiftType.XP,
  GiftType.Betting,
] as const

const TYPE_GROUP_2 = [GiftType.UniversalGaming] as const

export const GIFT_TYPES_FILTER = [...TYPE_GROUP_1, ...TYPE_GROUP_2] as const

type DepositField = 'depositLimits' |
'sums' |
'sumLimits' |
'winLimits' |
'maxSumForTransfer'

function getAvailableFields(gift: IGiftData): DepositField[] {
  const { type, sumsAsPercent = false, winLimitsAsPercent = false } = gift

  if (TYPE_GROUP_1.includes(type as typeof TYPE_GROUP_1[number])) {
    const fields: DepositField[] = ['depositLimits', 'sumLimits']

    if (!sumsAsPercent && has(gift, 'sums'))
      fields.push('sums')

    if (type === GiftType.Betting && has(gift, 'winLimits')) {
      fields.push('maxSumForTransfer')
      gift['maxSumForTransfer'] = gift.winLimits
    }

    return fields.filter(field => has(gift, field))
  }

  if (TYPE_GROUP_2.includes(type as typeof TYPE_GROUP_2[number])) {
    const fields: DepositField[] = ['depositLimits']

    if (!winLimitsAsPercent && has(gift, 'winLimits'))
      fields.push('winLimits')

    return fields.filter(field => has(gift, field))
  }

  return []
}

export function getGiftValueOptions(gift: IGiftData): OptionsItem[] {
  return getAvailableFields(gift).map(field => ({
    id: field === 'maxSumForTransfer' ? 'winLimits' : field,
    name: i18n.t(`component.variableGiftPreset.fields.${field}`),
  }))
}
