import type { TranslateResult } from 'vue-i18n'
import i18n from '../plugins/i18n'
import { getLocaleDateStringWithoutTimezone } from '../helpers/date'
import { SideBarCollapseItem } from '../@model/templates/baseList'
import type { BaseListItem } from '../@model/templates/baseList'
import { VColors } from '../@model/vuetify'
import type { SeoData } from './seo'
import type { FieldTranslationsData } from './translations'
import {
  NumberBaseField,
  RichTextBaseField,
  SelectBaseField,
  TextBaseField,
  TimeBaseField,
} from './templates/baseField'
import { FieldInfo, FieldType } from './field'
import type { StatusWithDateHistoryValue } from './view'
import { StatusWithVariant, ViewInfo, ViewType } from './view'
import type { TransactionType } from './enums/playersTransactions'
import type { ValidationRule } from './validations'
import type { BColors, BLightColors } from './bootstrap'

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
  readonly switch: FieldInfo
  readonly switchWithState: FieldInfo
  readonly text: TextBaseField
  readonly textWithCb: TextBaseField
  readonly richText: RichTextBaseField
  readonly email: TextBaseField
  readonly number: NumberBaseField
  readonly minute: FieldInfo
  readonly sumRange: FieldInfo
  readonly percent: FieldInfo
  readonly digits: NumberBaseField
  readonly password: FieldInfo
  readonly passwordFieldWithGeneration: FieldInfo
  readonly phone: FieldInfo
  readonly check: FieldInfo
  readonly radio: FieldInfo
  readonly checkGroup: FieldInfo
  readonly select: SelectBaseField
  readonly multiSelect: FieldInfo
  readonly date: FieldInfo
  readonly dateRange: FieldInfo
  readonly dateTime: FieldInfo
  readonly time: TimeBaseField
  readonly dateBtn: FieldInfo
  readonly textarea?: FieldInfo
  readonly textareaWithCounter: FieldInfo
  readonly tags: FieldInfo
  readonly url: TextBaseField
  readonly seo: SeoData
  readonly localisationParameters: Record<string, Record<string, string>>
  public fieldTranslations: FieldTranslationsData
  public image: string

  constructor(data) {
    this.id = data?.id
    this.image = data?.image
    this.switch = new FieldInfo({
      type: FieldType.Switch,
      key: 'switch',
      value: data?.switch,
      label: i18n.global.t('page.demo.switchField'),
    })
    this.text = new TextBaseField({
      key: 'text',
      value: data?.text,
      label: i18n.global.t('page.demo.textField'),
      validationRules: ['required'],
      isLocalization: true,
    })
    this.richText = new RichTextBaseField({
      key: 'richText',
      value: data?.text,
      label: i18n.global.t('common.richText'),
    })
    this.textWithCb = new TextBaseField({
      key: 'textWithCb',
      value: data?.textWithCb,
      label: i18n.global.t('page.demo.textFieldWithCb'),
      validationRules: ['required'],
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
      label: i18n.global.t('page.demo.numberField'),
      validationRules: ['required', 'min:3' as ValidationRule],
      withPositiveNumbers: true,
      info: i18n.global.t('page.demo.onlyPositiveNumbers'),
    })
    this.minute = new FieldInfo({
      type: FieldType.Minute,
      key: 'minute',
      value: data?.minute,
      label: i18n.global.t('page.demo.minuteField'),
      validationRules: 'positive',
    })
    this.percent = new FieldInfo({
      type: FieldType.Percent,
      key: 'percent',
      value: data?.percent,
      label: i18n.global.t('page.demo.percentField'),
      validationRules: 'required|length:2',
    })
    this.digits = new NumberBaseField({
      key: 'digits',
      value: data?.digits,
      label: i18n.global.t('page.demo.numberField'),
      validationRules: ['required', 'digits:4' as ValidationRule],
    })
    this.email = new TextBaseField({
      key: 'email',
      value: data?.email,
      label: i18n.global.t('common.email'),
      validationRules: ['required', 'email'],
    })
    this.sumRange = new FieldInfo({
      type: FieldType.SumRange,
      key: 'sumRange',
      value: data?.sumRange,
      label: i18n.global.t('page.demo.sumRangeField'),
    })
    this.phone = new FieldInfo({
      type: FieldType.Phone,
      key: 'phone',
      value: data?.phone,
      label: i18n.global.t('page.demo.phoneField'),
      validationRules: 'required|phone',
    })
    this.password = new FieldInfo({
      type: FieldType.Password,
      key: 'password',
      value: data?.password,
      label: i18n.global.t('page.demo.passwordField'),
      validationRules: 'required|password',
    })
    this.passwordFieldWithGeneration = new FieldInfo({
      type: FieldType.Password,
      key: 'password',
      value: data?.passwordWithGenerator,
      label: i18n.global.t('page.demo.passwordFieldWithGeneration'),
      validationRules: 'required|password',
    })
    this.switchWithState = new FieldInfo({
      type: FieldType.SwitchWithState,
      key: 'switchWithState',
      value: data?.switchWithState,
      label: i18n.global.t('page.demo.switchWithStateField'),
    })
    this.check = new FieldInfo({
      type: FieldType.Check,
      key: 'check',
      value: data?.check,
      label: i18n.global.t('page.demo.checkField'),
    })
    this.checkGroup = new FieldInfo({
      type: FieldType.CheckGroup,
      key: 'checkGroup',
      value: data?.checkGroup,
      label: i18n.global.t('page.demo.checkGroupField'),
      options: [
        {
          id: 'option1',
          name: 'Option 1',
        },
        {
          id: 'option2',
          name: 'Option 2',
        },
        {
          id: 'option3',
          name: 'Option 3',
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
    this.radio = new FieldInfo({
      type: FieldType.Radio,
      key: 'radio',
      value: true,
      label: i18n.global.t('page.demo.radioField'),
      options: [
        { text: i18n.global.t('common.yes'), value: true },
        { text: i18n.global.t('common.no'), value: false },
      ],
    })
    this.date = new FieldInfo({
      type: FieldType.Date,
      key: 'date',
      value: getLocaleDateStringWithoutTimezone(data?.date),
      label: i18n.global.t('page.demo.dateField'),
    })
    this.dateRange = new FieldInfo({
      type: FieldType.DateRange,
      key: 'dateRange',
      value: data?.dateRange,
      label: i18n.global.t('page.demo.dateRangeField'),
    })
    this.dateTime = new FieldInfo({
      type: FieldType.DateTime,
      key: 'dateTime',
      value: getLocaleDateStringWithoutTimezone(data?.dateTime),
      label: i18n.global.t('page.demo.dateTimeField'),
    })
    this.time = new TimeBaseField({
      key: 'time',
      value: data?.time,
      label: i18n.global.t('page.demo.timeField'),
    })
    this.dateBtn = new FieldInfo({
      type: FieldType.DateBtnOnly,
      key: 'dateBtn',
      value: data?.dateBtn,
      label: i18n.global.t('page.demo.dateBtnField'),
    })
    this.select = new SelectBaseField({
      key: 'select',
      value: data?.select,
      label: i18n.global.t('page.demo.selectField'),
      fetchOptionsActionName: 'demo/fetchOptions',
    })
    this.multiSelect = new FieldInfo({
      type: FieldType.MultiSelect,
      key: 'multiSelect',
      value: data?.multiSelect,
      label: i18n.global.t('page.demo.multiSelectField'),
      fetchOptionsActionName: 'demo/fetchOptions',
    })
    this.textarea = new FieldInfo({
      type: FieldType.Textarea,
      value: data?.textarea,
      key: 'textarea',
      label: i18n.global.t('page.demo.textareaField'),
    })
    this.textareaWithCounter = new FieldInfo({
      type: FieldType.TextareaWithCounter,
      value: data?.textareaWithCounter,
      key: 'textareaWithCounter',
      label: i18n.global.t('page.demo.textareaWithCounterField'),
      maxLength: 45,
    })
    this.url = new TextBaseField({
      value: data?.url,
      key: 'url',
      label: i18n.global.t('common.url'),
      validationRules: 'url',
    })
    this.tags = new FieldInfo({
      type: FieldType.Tags,
      value: data?.tags,
      key: 'tags',
      label: i18n.global.t('page.demo.tagsField'),
    })
    this.seo = data?.seo
    this.fieldTranslations = data?.fieldTranslations
    this.localisationParameters = data?.localisationParameters || {}
  }
}
export class DemoSideBar {
  readonly generalInfo: SideBarCollapseItem
  readonly info: SideBarCollapseItem
  readonly unuseble: SideBarCollapseItem
  readonly callbackData?: Record<string, unknown>

  constructor(data?: IDemoListItem) {
    this.generalInfo = new SideBarCollapseItem({
      title: i18n.global.t('common.generalInformation'),
      withBottomSeparator: true,
      views: {
        comment: new ViewInfo({
          type: ViewType.Comment,
          value: data?.comment,
          label: i18n.global.t('common.comment'),
        }),
        name: new ViewInfo({
          type: ViewType.Text,
          value: data?.name,
          label: i18n.global.t('common.name'),
        }),
        type: new ViewInfo({
          type: ViewType.TransactionType,
          value: data?.type.id,
          label: i18n.global.t('common.type'),
        }),
        date: new ViewInfo({
          type: ViewType.Date,
          value: data?.date,
          label: i18n.global.t('common.date'),
        }),
        id: new ViewInfo({
          type: ViewType.BadgeCopy,
          value: data?.id,
          label: i18n.global.t('common.id'),
        }),
        partnerCode: new ViewInfo({
          type: ViewType.BadgeShortCopy,
          value: data?.partnerCode,
          label: i18n.global.t('common.partnerCode'),
        }),
      },
    })
    this.info = new SideBarCollapseItem({
      title: i18n.global.t('common.mainInfo'),
      withBottomSeparator: true,
      views: {
        isActive: new ViewInfo({
          type: ViewType.Statement,
          value: !!data?.isActive,
          label: i18n.global.t('common.isActive'),
          withSeparator: true,
        }),
        amount: new ViewInfo({
          type: ViewType.SumAndCurrency,
          value: { amount: data?.amount, currency: data?.currency },
          label: i18n.global.t('common.sum'),
        }),
        id: new ViewInfo({
          type: ViewType.Status,
          value: data?.status,
          label: i18n.global.t('common.status'),
        }),
        tags: new ViewInfo({
          type: ViewType.Badges,
          value: data?.tags,
          withSearch: true,
          label: i18n.global.t('common.tags', { count: data?.tags?.length }),
        }),
        email: new ViewInfo({
          type: ViewType.Text,
          value: data?.email,
          label: i18n.global.t('common.email'),
        }),
        newDate: new ViewInfo({
          type: ViewType.DateWithSeconds,
          value: data?.newDate,
          label: i18n.global.t('common.dateOfCreation'),
        }),
        localization: new ViewInfo({
          type: ViewType.Locale,
          value: data?.localization,
          label: i18n.global.t('common.locale._'),
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
          label: i18n.global.t('common.log'),
        }),
      },
    })
    this.unuseble = new SideBarCollapseItem({
      title: i18n.global.t('common.additionalInfo'),
      views: {
        callbackData: data?.callbackData,
        link: new ViewInfo({
          type: ViewType.Link,
          value: { route: { name: 'PermissionPage' }, title: 'BO-Permission' },
          label: i18n.global.t('common.link'),
        }),
        objectToRows: new ViewInfo({
          type: ViewType.ObjectToRows,
          value: data?.period,
          label: i18n.global.t('common.data'),
        }),
        statusWithDate: new ViewInfo({
          type: ViewType.StatusWithDate,
          value: {
            status: new StatusWithVariant('active', VColors.Success),
            updatedAt: data?.date,
          },
          label: i18n.global.t('common.status'),
        }),
      },
    })
    this.callbackData = data?.callbackData
  }
}
