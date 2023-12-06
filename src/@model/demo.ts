import i18n from '../libs/i18n'
import { SeoData } from './seo'
import { FieldTranslationsData } from './translations'
import {
  MultiSelectBaseField,
  RatesBaseField,
  NumberBaseField,
  SelectBaseField,
  TextBaseField,
  TextareaBaseField,
  PasswordBaseField,
  TimeBaseField,
  PhoneBaseField,
  ConditionsBaseField,
  UsersListBaseField,
  SwitchBaseField,
  RadioBaseField,
  CheckBaseField,
  DateBaseField,
  FormDateBaseField,
  CheckGroupBaseField,
  TagsBaseField,
  NumberRangeBaseField,
} from './baseField'
import { StatusWithDateHistoryValue, StatusWithVariant, ViewInfo, ViewType } from './view'
import { BaseListItem, SideBarCollapseItem } from '../components/templates/BaseList/model'
import { TransactionType } from './enums/playersTransactions'
import { TranslateResult } from 'vue-i18n'
import { ValidationRule } from './validations'
import { BColors, BLightColors } from './bootstrap'
import { IconsList } from './enums/icons'
import { NumberRangeBaseValue } from '../@model/index'
import { BaseDatePeriod } from './date'

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
  imagePath: string
  tags: Array<IDemoTypeItem>
  type: {
    id: TransactionType
    name: TranslateResult
  }
  gameId: string
  state: boolean
  comment: string
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
  editableField: NumberRangeBaseValue

  constructor(data) {
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
    this.imagePath = data.imagePath
    this.tags = data.tags
    this.type = data.type
    this.gameId = data.gameId
    this.state = data.state
    this.comment = data.comment
    this.rowVariant = data?.rowVariant
    this.editableField = data?.editableField
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
  readonly dateBtn: FormDateBaseField
  readonly textarea?: TextareaBaseField
  readonly textareaWithCounter: TextareaBaseField
  readonly tags: TagsBaseField
  readonly url: TextBaseField
  readonly seo: SeoData
  readonly localisationParameters: Record<string, Record<string, string>>
  public fieldTranslations: FieldTranslationsData
  public image: string
  readonly conditions: ConditionsBaseField
  public usersList: UsersListBaseField

  constructor(data) {
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
      validationRules: ['required'],
      isLocalization: true,
    })
    this.textWithCb = new TextBaseField({
      key: 'textWithCb',
      value: data?.textWithCb,
      label: i18n.t('page.demo.textFieldWithCb'),
      validationRules: ['required'],
      isLocalization: true,
      serialize: (value: string) => {
        if (value?.includes('demo:')) return value
        return `demo:${value}`
      },
      deserialize: (value: string) => {
        if (value?.includes('demo:')) return value
        return value?.substring(5)
      },
    })
    this.number = new NumberBaseField({
      key: 'number',
      value: data?.number,
      label: i18n.t('page.demo.numberField'),
      validationRules: ['required', 'min:3' as ValidationRule],
      withPositiveNumbers: true,
      info: i18n.t('page.demo.onlyPositiveNumbers'),
    })
    this.minute = new NumberBaseField({
      key: 'minute',
      value: data?.minute,
      label: i18n.t('page.demo.minuteField'),
      validationRules: 'positive',
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
      validationRules: ['required_object', 'range:from,to' as ValidationRule],
      isCurrency: false,
    })
    this.percent = new NumberBaseField({
      key: 'percent',
      value: data?.percent,
      label: i18n.t('page.demo.percentField'),
      validationRules: ['required', 'length:2' as ValidationRule],
      append: '%',
    })
    this.digits = new NumberBaseField({
      key: 'digits',
      value: data?.digits,
      label: i18n.t('page.demo.numberField'),
      validationRules: ['required', 'digits:4' as ValidationRule],
    })
    this.email = new TextBaseField({
      key: 'email',
      value: data?.email,
      label: i18n.t('common.email'),
      validationRules: ['required', 'email'],
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
      validationRules: ['required'],
    })
    this.phone = new PhoneBaseField({
      key: 'phone',
      value: data?.phone,
      label: i18n.t('page.demo.phoneField'),
      validationRules: ['required', 'phone'],
    })
    this.password = new PasswordBaseField({
      key: 'password',
      value: data?.password,
      label: i18n.t('page.demo.passwordField'),
      validationRules: ['required', 'password'],
    })
    this.passwordFieldWithGeneration = new PasswordBaseField({
      key: 'password',
      value: data?.passwordWithGenerator,
      label: i18n.t('page.demo.passwordFieldWithGeneration'),
      validationRules: ['required', 'password'],
      showPassword: true,
      withPasswordGenerator: true,
    })
    this.switchWithState = new SwitchBaseField({
      key: 'switchWithState',
      value: data?.switchWithState,
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
    this.dateBtn = new FormDateBaseField({
      key: 'dateBtn',
      value: data?.dateBtn,
      label: i18n.t('page.demo.dateBtnField'),
      buttonOnly: true,
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
      validationRules: 'url',
    })
    this.tags = new TagsBaseField({
      value: data?.tags,
      key: 'tags',
      label: i18n.t('page.demo.tagsField'),
    })
    this.conditions = new ConditionsBaseField({
      value: data?.conditions,
      key: 'conditions',
      label: i18n.t('page.demo.conditionsField'),
      placeholder: i18n.t('component.conditions.placeholder'),
      validationRules: 'required',
      fetchOptionsActionName: 'conditions/fetchConditions',
    })
    this.seo = data?.seo
    this.fieldTranslations = data?.fieldTranslations
    this.localisationParameters = data?.localisationParameters || {}
    this.usersList = new UsersListBaseField({
      key: 'users-list',
      label: i18n.t('page.demo.usersList'),
      value: data?.usersList,
    })
  }
}

export class DemoSideBar {
  readonly generalInfo: SideBarCollapseItem
  readonly info: SideBarCollapseItem
  readonly unuseble: SideBarCollapseItem

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
          icon: IconsList.AtSignIcon,
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
        link: new ViewInfo({
          type: ViewType.Link,
          value: { route: { name: 'PermissionPage' }, title: 'BO-Permission' },
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
            status: new StatusWithVariant('active', 'light-warning'),
            updatedAt: data?.date,
          },
          label: i18n.t('common.status'),
        }),
      },
    })
  }
}
