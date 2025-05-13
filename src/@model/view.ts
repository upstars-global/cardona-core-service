import type { TranslateResult } from 'vue-i18n'
import { markRaw } from 'vue'
import type { Raw } from 'vue'
import TextView from '../components/templates/ViewGenerator/_components/TextView.vue'
import BadgesView from '../components/templates/ViewGenerator/_components/BadgesView.vue'
import BadgeView from '../components/templates/ViewGenerator/_components/BadgeView.vue'
import StatusView from '../components/templates/ViewGenerator/_components/StatusView.vue'
import StatusWithDateView from '../components/templates/ViewGenerator/_components/StatusWithDateView.vue'
import StatusWithDateHistoryView from '../components/templates/ViewGenerator/_components/StatusWithDateHistoryView.vue'
import StatementView from '../components/templates/ViewGenerator/_components/StatementView.vue'
import LinkView from '../components/templates/ViewGenerator/_components/LinkView.vue'
import InnerBlankLinkView from '../components/templates/ViewGenerator/_components/InnerBlankLinkView.vue'
import BadgeCopyView from '../components/templates/ViewGenerator/_components/BadgeCopyView.vue'
import BadgeShortCopyView from '../components/templates/ViewGenerator/_components/BadgeShortCopyView.vue'
import CopyView from '../components/templates/ViewGenerator/_components/CopyView.vue'
import DateView from '../components/templates/ViewGenerator/_components/DateView.vue'
import DateRangeView from '../components/templates/ViewGenerator/_components/DateRangeView.vue'
import DateWithSecondsView from '../components/templates/ViewGenerator/_components/DateWithSecondsView.vue'
import SumAndCurrencyView from '../components/templates/ViewGenerator/_components/SumAndCurrencyView.vue'
import CommentView from '../components/templates/ViewGenerator/_components/CommentView.vue'
import TransactionTypeView from '../components/templates/ViewGenerator/_components/TransactionTypeView.vue'
import ObjectToRowsView from '../components/templates/ViewGenerator/_components/ObjectToRowsView.vue'
import LocaleView from '../components/templates/ViewGenerator/_components/LocaleView.vue'
import RegionView from '../components/templates/ViewGenerator/_components/RegionView.vue'
import SumPeriodView from '../components/templates/ViewGenerator/_components/SumPeriodView.vue'
import type { IconsList } from './enums/icons'
import type { PermissionType } from '@permissions'

export enum ViewType {
  Text = TextView,
  Locale = LocaleView,
  Region = RegionView,
  Link = LinkView,
  InnerBlankLink = InnerBlankLinkView,
  Badges = BadgesView,
  Badge = BadgeView,
  Status = StatusView,
  Statement = StatementView,
  Date = DateView,
  DateRange = DateRangeView,
  DateWithSeconds = DateWithSecondsView,
  BadgeCopy = BadgeCopyView,
  BadgeShortCopy = BadgeShortCopyView,
  Copy = CopyView,
  SumAndCurrency = SumAndCurrencyView,
  StatusWithDate = StatusWithDateView,
  StatusWithDateHistory = StatusWithDateHistoryView,
  Comment = CommentView,
  TransactionType = TransactionTypeView,
  ObjectToRows = ObjectToRowsView,
  SumPeriod = SumPeriodView,
}
export enum ViewJustifyContent {
  Start = 'start',
  Between = 'between',
  End = 'end',
  Center = 'center',
}

export interface LinkViewValue {
  title: TranslateResult
  route?: any // TODO Location
  modalId?: string
}

export interface SumAndCurrencyViewValue {
  remainder: number
  amount: number
  currency: string
}

export interface StatusWithDateValue {
  status: string | IStatusWithVariant
  updatedAt: string | Date
}

export interface StatusWithDateHistoryValue {
  title: string
  date: string | Date
}

export interface IStatusWithVariant {
  status: TranslateResult
  variant: string
}

export class StatusWithVariant implements IStatusWithVariant {
  public status: string
  public variant: string
  constructor(status: string, variant: string) {
    this.status = status
    this.variant = variant
  }
}
interface IViewInfo {
  readonly type?: ViewType
  readonly value?: LinkViewValue | SumAndCurrencyViewValue | StatusWithDateValue | any
  readonly label?: TranslateResult
  readonly description?: TranslateResult
  readonly icon?: IconsList | ''
  readonly withSeparator?: boolean
  readonly permission?: PermissionType
  readonly withSearch?: boolean
}

// TODO: Delete T = {} All project https://upstars.atlassian.net/browse/BAC-1177
export class ViewInfo {
  readonly type?: Raw<object>
  readonly value: LinkViewValue | SumAndCurrencyViewValue | StatusWithDateValue | any
  readonly label?: TranslateResult
  readonly description?: TranslateResult
  readonly icon?: IconsList | ''
  readonly withSeparator?: boolean
  readonly permission?: PermissionType
  readonly withSearch?: boolean

  constructor(data: IViewInfo) {
    this.type = markRaw(data.type || {})
    this.value = data?.value
    this.label = data?.label
    this.description = data?.description
    this.icon = data?.icon
    this.withSeparator = data?.withSeparator
    this.withSearch = data?.withSearch
    this.permission = data?.permission
  }
}
