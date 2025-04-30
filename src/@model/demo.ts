import type { TranslateResult } from 'vue-i18n'
import { v4 as uuidv4 } from 'uuid'
import { i18n } from '../plugins/i18n'
import { SideBarCollapseItem } from '../@model/templates/baseList'
import type { BaseListItem } from '../@model/templates/baseList'
import { VColors } from '../@model/vuetify'
import type { TranslationForm } from './translations'
import {
  CheckBaseField, CheckGroupBaseField,
  ConditionsBaseField,
  DateBaseField, MultiSelectBaseField,
  NumberBaseField, NumberRangeBaseField, PasswordBaseField, PhoneBaseField, RadioBaseField, RatesBaseField,
  SelectBaseField, SwitchBaseField, TagsBaseField, TextBaseField,
  TextareaBaseField,
  TimeBaseField, UsersListBaseField,
} from './templates/baseField'
import type { StatusWithDateHistoryValue } from './view'
import { StatusWithVariant, ViewInfo, ViewType } from './view'
import type { TransactionType } from './enums/playersTransactions'
import type { BColors, BLightColors } from './bootstrap'
import { BaseDatePeriod } from './date'
import { SeoForm } from './seo'
import { getTranslationForm } from './translations'
import { CurrencyBaseField } from '@/@model/templates/baseField/currency'

export interface PhoneAndCountry {
  phone: string
  country: string
}

interface PhoneAndCountryFieldListItem {
  phone: PhoneBaseField
  country: SelectBaseField
}
export interface IDemoTypeItem {
  id: string
  name: string
  position?: number
}
export interface IDemoListItem {
  id: string
  shortId: string
  partnerCode: string
  name: string
  isActive: boolean
  status: string
  amount: number
  currency: string
  wagerValue: string
  wagerLimit: string
  date: string
  newDate: string
  email: string
  period: {
    dateFrom: string
    dateTo: string
  }
  buttonName: string
  login: string
  localization: string
  country: string
  position: number
  positionByInputWrapper: number
  imagePath: string
  tags: Array<IDemoTypeItem>
  type: {
    id: TransactionType
    name: TranslateResult
  }
  gameId: string
  state: boolean
  comment: string
  rowVariant: BColors | BLightColors
  callbackData: Record<string, unknown>
}

export class DemoListItem implements BaseListItem {
  id: string
  partnerCode: string
  name: string
  nameWithShortId: string
  isActive: boolean
  status: string
  amount: number
  currency: string
  wagerValue: string
  wagerLimit: string
  date: string
  newDate: string
  email: string
  period: {
    dateFrom: string
    dateTo: string
  }

  buttonName: string
  login: string
  localization: string
  country: string
  position: number
  positionByInputWrapper: number
  imagePath: string
  tags: Array<IDemoTypeItem>
  type: {
    id: TransactionType
    name: TranslateResult
  }

  gameId: string
  state: boolean
  comment: string
  rowVariant: BColors | BLightColors

  constructor(data: IDemoListItem) {
    this.id = data.id
    this.partnerCode = data.partnerCode
    this.name = data.name
    this.nameWithShortId = data.name
    this.isActive = data.isActive
    this.status = data.status
    this.amount = data.amount
    this.currency = data.currency
    this.wagerValue = data.wagerValue
    this.wagerLimit = data.wagerLimit
    this.date = data.date
    this.newDate = data.newDate
    this.email = data.email
    this.period = data.period
    this.buttonName = data.buttonName
    this.login = data.login
    this.localization = data.localization
    this.country = data.country
    this.position = data.position
    this.positionByInputWrapper = data.positionByInputWrapper
    this.imagePath = data.imagePath
    this.tags = data.tags
    this.type = data.type
    this.gameId = data.gameId
    this.state = data.state
    this.comment = data.comment
    this.rowVariant = data?.rowVariant
  }
}

export interface IDemoFilter {
  readonly search?: string
  readonly createdFrom?: string
  readonly createdTo?: string
  readonly isActive?: boolean
  readonly type: string
  readonly tagsIds?: Array<string>
  readonly gameId?: string
}
export class DemoFilter {
  readonly search?: string
  readonly isActive?: boolean
  readonly type: string
  readonly tagsIds?: Array<string>
  readonly gameId?: string
  readonly createdFrom?: string
  readonly createdTo?: string
  constructor(data: IDemoFilter) {
    this.search = data.search
    this.createdFrom = data.createdFrom
    this.createdTo = data.createdTo
    this.isActive = data.isActive
    this.tagsIds = data.tagsIds
    this.type = data.type
    this.gameId = data.gameId
  }
}
export class DemoForm {
  readonly id?: string
  readonly switch: SwitchBaseField
  readonly switchWithState: SwitchBaseField
  readonly text: TextBaseField
  readonly textWithCb: TextBaseField
  readonly email: TextBaseField
  readonly number: NumberBaseField
  readonly minute: NumberBaseField
  readonly minutesRange: NumberRangeBaseField
  readonly sumRange: NumberRangeBaseField
  readonly rates: RatesBaseField
  readonly percent: NumberBaseField
  readonly digits: NumberBaseField
  readonly password: PasswordBaseField
  readonly passwordFieldWithGeneration: PasswordBaseField
  readonly phone: PhoneBaseField
  readonly check: CheckBaseField
  readonly radio: RadioBaseField
  readonly checkGroup: CheckGroupBaseField
  readonly nonClearableSelect: SelectBaseField
  readonly select: SelectBaseField
  readonly multiSelect: MultiSelectBaseField
  readonly date: DateBaseField
  readonly dateRange: DateBaseField
  readonly dateTimeRange: DateBaseField
  readonly dateTime: DateBaseField
  readonly time: TimeBaseField
  readonly textarea?: TextareaBaseField
  readonly textareaWithAutoHeight?: TextareaBaseField
  readonly textareaWithCounter: TextareaBaseField
  readonly tags: TagsBaseField
  readonly url: TextBaseField
  readonly seo: SeoForm
  readonly localisationParameters: Record<string, Record<string, string>>
  public fieldTranslations: TranslationForm
  public image: string
  readonly conditions: ConditionsBaseField
  public usersList: UsersListBaseField
  public phoneList: Array<PhoneAndCountryFieldListItem>
  public currency: CurrencyBaseField

  constructor(data: any) {
    this.id = data?.id
    this.image = data?.image
    this.switch = new SwitchBaseField({
      key: 'switch',
      value: data?.switch,
      label: i18n.t('page.demo.switchField'),
    })
    this.text = new TextBaseField({
      key: 'text',
      value: data?.text,
      label: i18n.t('page.demo.textField'),
      validationRules: { required: true },
      isLocalization: true,
    })
    this.textWithCb = new TextBaseField({
      key: 'textWithCb',
      value: data?.textWithCb,
      label: i18n.t('page.demo.textFieldWithCb'),
      validationRules: { required: true },
      isLocalization: true,
      serialize: (value: string) => {
        if (value?.includes('demo:'))
          return value

        return `demo:${value}`
      },
      deserialize: (value: string) => {
        if (value?.includes('demo:'))
          return value

        return value?.substring(5)
      },
    })
    this.number = new NumberBaseField({
      key: 'number',
      value: data?.number,
      label: i18n.t('page.demo.numberField'),
      validationRules: { required: true, min: 3 },
      withPositiveNumbers: true,
      info: i18n.t('page.demo.onlyPositiveNumbers'),
    })
    this.minute = new NumberBaseField({
      key: 'minute',
      value: data?.minute,
      label: i18n.t('page.demo.minuteField'),
      validationRules: { positive: true },
      append: 'min',
      withPositiveNumbers: true,
      isIntegerNumbers: true,
    })
    this.minutesRange = new NumberRangeBaseField({
      value: data?.minutesRange,
      withPositiveNumbers: true,
      isIntegerNumbers: true,
      append: 'min',
      key: 'minutesRange',
      label: i18n.t('page.demo.minutesRangeField'),
      validationRules: { required: true, required_object: true, range: ['from', 'to'] },
      isCurrency: false,
    })
    this.percent = new NumberBaseField({
      key: 'percent',
      value: data?.percent,
      label: i18n.t('page.demo.percentField'),
      validationRules: { required: true, length: 2 },
      append: '%',
    })
    this.digits = new NumberBaseField({
      key: 'digits',
      value: data?.digits,
      label: i18n.t('page.demo.numberField'),
      validationRules: { required: true, digits: 4 },
    })
    this.email = new TextBaseField({
      key: 'email',
      value: data?.email,
      label: i18n.t('common.email'),
      validationRules: { required: true, email: true },
    })
    this.sumRange = new NumberRangeBaseField({
      key: 'sumRange',
      value: data?.sumRange,
      label: i18n.t('page.demo.sumRangeField'),
    })
    this.rates = new RatesBaseField({
      key: 'rates',
      value: data?.rates,
      label: i18n.t('page.demo.rates'),
      placeholder: '0.00',
      trackBy: 'bet',
      validationRules: { required: true },
    })
    this.currency = new CurrencyBaseField({
      key: 'currency',
      placeholder: '0.0',
      value: { currency: 'USD', value: 123 },
      label: 'USD',
      validationRules: { required: true },
      isIntegerNumbers: true,
      withPositiveNumbers: true,
      info: 'This is currency field, with logic of rates field',
    })
    this.phone = new PhoneBaseField({
      key: 'phone',
      value: data?.phone,
      label: i18n.t('page.demo.phoneField'),
      validationRules: { required: true, phone: true },
    })
    this.phoneList = data?.phoneList?.map(createPhoneDomainFieldItem) || []
    this.password = new PasswordBaseField({
      key: 'password',
      value: data?.password,
      label: i18n.t('page.demo.passwordField'),
      validationRules: { required: true, password: true },
    })
    this.passwordFieldWithGeneration = new PasswordBaseField({
      key: 'passwordWithGenerator',
      value: data?.passwordWithGenerator,
      label: i18n.t('page.demo.passwordFieldWithGeneration'),
      validationRules: { required: true, password: true },
      showPassword: true,
      withPasswordGenerator: true,
    })
    this.switchWithState = new SwitchBaseField({
      key: 'switchWithState',
      value: true,
      label: i18n.t('page.demo.switchWithStateField'),
      withState: true,
    })
    this.check = new CheckBaseField({
      key: 'check',
      value: data?.check,
      label: i18n.t('page.demo.checkField'),
    })
    this.checkGroup = new CheckGroupBaseField({
      key: 'checkGroup',
      value: data?.checkGroup,
      label: i18n.t('page.demo.checkGroupField'),
      options: [
        {
          id: 'option1',
          name: 'Option 1',
        },
        {
          id: 'option2',
          name: 'Option 2',
          disabled: true,
        },
        {
          id: 'option3',
          name: 'Option 3',
          disabled: true,
        },
        {
          id: 'option4',
          name: 'Option 4',
        },
        {
          id: 'option5',
          name: 'Option 5',
        },
      ],
    })
    this.radio = new RadioBaseField({
      key: 'radio',
      value: true,
      label: i18n.t('page.demo.radioField'),
      options: [
        { text: i18n.t('common.yes'), value: true },
        { text: i18n.t('common.no'), value: false },
      ],
    })
    this.date = new DateBaseField({
      key: 'date',
      value: data?.date,
      label: i18n.t('page.demo.dateField'),
      validationRules: { required: true },
    })
    this.dateRange = new DateBaseField({
      key: 'dateRange',
      value: new BaseDatePeriod(data?.dateRangeFrom, data?.dateRangeTo),
      label: i18n.t('page.demo.dateRangeField'),
      isRangeMode: true,
    })
    this.dateTimeRange = new DateBaseField({
      key: 'dateTimeRange',
      value: new BaseDatePeriod(data?.dateTimeRangeFrom, data?.dateTimeRangeTo),
      label: i18n.t('page.demo.dateTimeRangeField'),
      isRangeMode: true,
      withTime: true,
    })
    this.dateTime = new DateBaseField({
      key: 'dateTime',
      value: data?.dateTime,
      label: i18n.t('page.demo.dateTimeField'),
      withTime: true,
    })
    this.time = new TimeBaseField({
      key: 'time',
      value: data?.time,
      label: i18n.t('page.demo.timeField'),
    })
    this.nonClearableSelect = new SelectBaseField({
      key: 'nonClearableSelect',
      value: data?.nonClearableSelect,
      label: i18n.t('page.demo.nonClearableSelectField'),
      fetchOptionsActionName: 'demo/fetchOptions',
      clearable: false,
    })
    this.select = new SelectBaseField({
      key: 'select',
      value: data?.select,
      label: i18n.t('page.demo.selectField'),
      fetchOptionsActionName: 'demo/fetchOptions',
    })
    this.multiSelect = new MultiSelectBaseField({
      key: 'multiSelect',
      value: data?.multiSelect,
      label: i18n.t('page.demo.multiSelectField'),
      fetchOptionsActionName: 'demo/fetchOptions',
    })
    this.textarea = new TextareaBaseField({
      value: data?.textarea,
      key: 'textarea',
      label: i18n.t('page.demo.textareaField'),
    })
    this.textareaWithAutoHeight = new TextareaBaseField({
      value: data?.textareaWithAutoHeight,
      key: 'textareaForAutoHeight',
      label: i18n.t('page.demo.textareaField'),
      autoHeight: true,
    })
    this.textareaWithCounter = new TextareaBaseField({
      value: data?.textareaWithCounter,
      key: 'textareaWithCounter',
      label: i18n.t('page.demo.textareaWithCounterField'),
      maxLength: 45,
      rows: 3,
      counter: true,
    })
    this.url = new TextBaseField({
      value: data?.url,
      key: 'url',
      label: i18n.t('common.url'),
      validationRules: { url: true },
    })
    this.tags = new TagsBaseField({
      value: data?.tags,
      key: 'tags',
      label: i18n.t('page.demo.tagsField'),
      placeholder: i18n.t('common.addTags'),
    })
    this.conditions = new ConditionsBaseField({
      value: data?.conditions,
      key: 'conditions',
      label: i18n.t('page.demo.conditionsField'),
      placeholder: i18n.t('component.conditions.placeholder'),
      validationRules: { required: true },
      fetchOptionsActionName: 'conditions/fetchConditions',
    })
    this.usersList = new UsersListBaseField({
      key: 'users-list',
      label: i18n.t('page.demo.usersList'),
      value: data?.usersList,
    })
    this.localisationParameters = data?.localisationParameters || {}
    this.seo = new SeoForm(data?.seo)
    this.fieldTranslations = getTranslationForm(this, data)
  }
}
export class DemoSideBar {
  readonly generalInfo: SideBarCollapseItem
  readonly info: SideBarCollapseItem
  readonly unuseble: SideBarCollapseItem
  readonly callbackData?: Record<string, unknown>

  constructor(data?: IDemoListItem) {
    this.generalInfo = new SideBarCollapseItem({
      title: i18n.t('common.generalInformation'),
      withBottomSeparator: true,
      views: {
        comment: new ViewInfo({
          type: ViewType.Comment,
          value: data?.comment,
          label: i18n.t('common.comment'),
        }),
        name: new ViewInfo({
          type: ViewType.Text,
          value: data?.name,
          label: i18n.t('common.name'),
        }),
        type: new ViewInfo({
          type: ViewType.TransactionType,
          value: data?.type.id,
          label: i18n.t('common.type'),
        }),
        date: new ViewInfo({
          type: ViewType.Date,
          value: data?.date,
          label: i18n.t('common.date'),
        }),
        id: new ViewInfo({
          type: ViewType.BadgeCopy,
          value: data?.id,
          label: i18n.t('common.id'),
        }),
        partnerCode: new ViewInfo({
          type: ViewType.BadgeShortCopy,
          value: data?.partnerCode,
          label: i18n.t('common.partnerCode'),
        }),
      },
    })
    this.info = new SideBarCollapseItem({
      title: i18n.t('common.mainInfo'),
      withBottomSeparator: true,
      views: {
        isActive: new ViewInfo({
          type: ViewType.Statement,
          value: !!data?.isActive,
          label: i18n.t('common.isActive'),
          withSeparator: true,
        }),
        amount: new ViewInfo({
          type: ViewType.SumAndCurrency,
          value: { amount: data?.amount, currency: data?.currency },
          label: i18n.t('common.sum'),
        }),
        id: new ViewInfo({
          type: ViewType.Status,
          value: data?.status,
          label: i18n.t('common.status'),
        }),
        tags: new ViewInfo({
          type: ViewType.Badges,
          value: data?.tags,
          withSearch: true,
          label: i18n.t('common.tags', { count: data?.tags?.length }),
        }),
        email: new ViewInfo({
          type: ViewType.Copy,
          value: data?.email,
          label: i18n.t('common.email'),
        }),
        newDate: new ViewInfo({
          type: ViewType.DateWithSeconds,
          value: data?.newDate,
          label: i18n.t('common.dateOfCreation'),
        }),
        localization: new ViewInfo({
          type: ViewType.Locale,
          value: data?.localization,
          label: i18n.t('common.locale._'),
        }),
        statusList: new ViewInfo({
          type: ViewType.StatusWithDateHistory,
          value: [
            {
              title: 'Erased by withdraw | ForceExpireCommand',
              date: data?.date,
            },
            {
              title: 'Waiting | promo_gift',
              date: data?.date,
            },
            {
              title: 'Received | promo_gift',
              date: data?.date,
            },
          ] as StatusWithDateHistoryValue[],
          label: i18n.t('common.log'),
        }),
      },
    })
    this.unuseble = new SideBarCollapseItem({
      title: i18n.t('common.additionalInfo'),
      views: {
        callbackData: data?.callbackData,
        link: new ViewInfo({
          type: ViewType.Link,
          value: { route: { name: 'PermissionPage', params: { id: 'demo' } }, title: 'Permission' },
          label: i18n.t('common.link'),
        }),
        objectToRows: new ViewInfo({
          type: ViewType.ObjectToRows,
          value: data?.period,
          label: i18n.t('common.data'),
        }),
        statusWithDate: new ViewInfo({
          type: ViewType.StatusWithDate,
          value: {
            status: new StatusWithVariant('active', VColors.Success),
            updatedAt: data?.date,
          },
          label: i18n.t('common.status'),
        }),
      },
    })
    this.callbackData = data?.callbackData
  }
}

export const createPhoneDomainFieldItem = (item: PhoneAndCountry) => ({
  phone: new PhoneBaseField({
    key: `id-${uuidv4()}`,
    value: item?.phone || '',
    label: i18n.t('common.phone._'),
    validationRules: { required: true, phone: true },
  }),
  domain: new SelectBaseField({
    key: `country-${uuidv4()}`,
    value: item?.country || '',
    label: i18n.t('common.country'),
    options: [
      { id: 1, name: 'Ukraine' },
      { id: 2, name: 'Poland' },
      { id: 3, name: 'Latvia' },
    ],
    validationRules: { required: true },
  }),
})
