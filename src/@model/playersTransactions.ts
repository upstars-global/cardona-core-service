import { SumAndCurrencyViewValue, ViewInfo, ViewType } from '../@model/view'
import i18n from '../libs/i18n'
import { FieldInfo, FieldType } from '../@model/field'
import { OptionsItem } from '../@model/index'

export class PlayersTransactionsFilters {
  readonly id: string
  readonly search?: string

  constructor(data) {
    this.id = data.id
    this.search = data.search
  }
}

export enum TransactionType {
  Payout = 'payout',
  Deposit = 'deposit',
}

// Sidebar
export class SideBar {
  readonly type: ViewInfo
  readonly id: ViewInfo
  readonly amount: ViewInfo
  readonly paymentSystem: ViewInfo
  readonly walletId: ViewInfo
  readonly created: ViewInfo
  readonly processed: ViewInfo
  readonly status: ViewInfo
  readonly comment: ViewInfo
  readonly cancelReason?: ViewInfo
  readonly callbackData?: Record<string, unknown>

  constructor(data) {
    this.type = new ViewInfo({
      type: ViewType.TransactionType,
      value: data?.type,
      label: String(i18n.t('common.type')),
    })
    this.id = new ViewInfo({
      type: ViewType.BadgeCopy,
      value: data?.id,
      label: String(i18n.t('common.id')),
    })
    this.amount = new ViewInfo({
      type: ViewType.SumAndCurrency,
      value: {
        amount: data?.amount,
        currency: data?.currency,
      } as SumAndCurrencyViewValue,
      label: String(i18n.t('common.sum')),
    })
    this.paymentSystem = new ViewInfo({
      type: ViewType.Text,
      value: data?.paymentSystem,
      label: String(i18n.t('page.supportService.paymentSystem')),
    })
    this.walletId = new ViewInfo({
      type: ViewType.Text,
      value: data?.walletId,
      label: String(i18n.t('page.supportService.requisites')),
    })
    this.created = new ViewInfo({
      type: ViewType.Date,
      value: data?.createdAt,
      label: String(i18n.t('common.created')),
    })
    this.processed = new ViewInfo({
      type: ViewType.Date,
      value: data?.processedAt,
      label: String(i18n.t('common.processed')),
    })
    this.status = new ViewInfo({
      type: ViewType.Status,
      value: data?.status,
      label: String(i18n.t('common.status')),
    })
    this.comment = new ViewInfo({
      type: ViewType.Comment,
      value: data?.comment,
      label: String(i18n.t('common.comment._')),
      withSeparator: !data?.cancelReason && !!data?.callbackData,
    })
    this.cancelReason =
      data?.cancelReason &&
      new ViewInfo({
        type: ViewType.Comment,
        value: data.cancelReason,
        label: String(i18n.t('page.supportService.cancelReason')),
        withSeparator: !!data?.callbackData,
      })
    this.callbackData = data?.callbackData
  }
}

//Modal
export const UpdateBonusType = {
  Replenishment: 'replenishment',
  Withdrawal: 'withdrawal',
} as const

type UpdateBonus = (typeof UpdateBonusType)[keyof typeof UpdateBonusType]

export class PlayersUpdateBonusForm {
  readonly amount: FieldInfo
  readonly comment: FieldInfo
  readonly method: FieldInfo
  readonly giftId: FieldInfo
  readonly cause: FieldInfo
  readonly isAddTransactions: FieldInfo
  readonly type?: UpdateBonus

  constructor({ type, playerId }: { type: UpdateBonus; playerId?: string }) {
    this.type = type
    this.amount = new FieldInfo({
      type: FieldType.Number,
      key: 'amount',
      label:
        type === UpdateBonusType.Replenishment
          ? String(i18n.t('common.transactions.amount.labelIncrease'))
          : String(i18n.t('common.transactions.amount.labelDecrease')),
      placeholder: String(i18n.t('common.transactions.amount.placeholder')),
      validationRules: 'required',
    })
    this.comment = new FieldInfo({
      type: FieldType.Textarea,
      key: 'comment',
      label: String(i18n.t('common.comment._')),
    })
    this.method = new FieldInfo({
      type: FieldType.Select,
      key: 'method',
      label: String(i18n.t('common.transactions.method')),
      validationRules: 'required',
      options: [
        {
          id: 'deposit_manager_cards',
          name: 'Deposit manager cards',
        } as OptionsItem,
        {
          id: 'deposit_manager_other',
          name: 'Deposit manager other',
        } as OptionsItem,
        {
          id: 'deposit_manager_lost',
          name: 'Deposit manager lost',
        } as OptionsItem,
      ],
    })
    this.giftId = new FieldInfo({
      type: FieldType.Select,
      key: 'giftId',
      label: String(i18n.t('common.transactions.gift')),
      fetchOptionsActionName: 'playersTransactions/fetchGiftsList',
      staticFilters: { playerId } as Record<string, string>,
    })
    this.cause = new FieldInfo({
      type: FieldType.Select,
      key: 'cause',
      label: String(i18n.t('common.transactions.cause')),
      options: [
        {
          id: 'Compensation. Lost withdrawal',
          name: 'Compensation. Lost withdrawal',
        } as OptionsItem,
        {
          id: 'Compensation. Lost winnings in the game',
          name: 'Compensation. Lost winnings in the game',
        } as OptionsItem,
        {
          id: 'Compensation. Winback write-off',
          name: 'Compensation. Winback write-off',
        } as OptionsItem,
        {
          id: 'No deposit accrual. Loyalty',
          name: 'No deposit accrual. Loyalty',
        } as OptionsItem,
      ],
    })
    this.isAddTransactions = new FieldInfo({
      type: FieldType.Switch,
      key: 'isAddTransactions',
      label:
        type === UpdateBonusType.Replenishment
          ? String(i18n.t('common.transactions.isAddTransactions.labelAccrue'))
          : String(i18n.t('common.transactions.isAddTransactions.labelDecrease')),
    })
  }
}
export enum UpdateBonusStrategy {
  Transaction = 'transaction',
  Direct = 'direct',
}
export class SendUpdateBonusPayload {
  readonly playerId: string
  readonly amount: number
  readonly comment: string
  readonly method?: string
  readonly giftId?: string
  readonly currency?: string
  readonly type?: string
  readonly strategy?: string

  constructor(data) {
    this.playerId = data.playerId

    if (data?.comment?.value && data?.cause?.value?.id) {
      this.comment = `${data.comment.value}. ${data.cause.value.id}`
    } else if (!data?.comment?.value && data?.cause?.value?.id) {
      this.comment = data.cause.value.id
    } else {
      this.comment = data?.comment?.value
    }

    this.amount = Number(data.amount.value) * 100
    this.currency = data?.currency
    this.type = data?.type
    this.method = data?.method?.value?.id
    this.giftId = data?.giftId?.value?.id

    if (data.isAddTransactions.value) {
      this.strategy = UpdateBonusStrategy.Transaction
    } else {
      this.strategy = UpdateBonusStrategy.Direct
    }
  }
}
