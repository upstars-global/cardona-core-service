import i18n from '../libs/i18n'
import { SeoData } from './seo'
import { FieldTranslationsData } from './translations'
import { NumberBaseField, SelectBaseField, TextBaseField } from './baseField'
import { FieldInfo, FieldType } from './field'
import { getLocaleDateStringWithoutTimezone } from '../helpers/date'

export class DemoFilter {
  constructor() {}
}

export class DemoForm {
  readonly id?: string
  readonly switch: FieldInfo
  readonly switchWithState: FieldInfo
  readonly text: TextBaseField
  readonly number: NumberBaseField
  readonly minute: FieldInfo
  readonly sumRange: FieldInfo
  readonly percent: FieldInfo
  readonly password: FieldInfo
  readonly phone: FieldInfo
  readonly check: FieldInfo
  readonly radio: FieldInfo
  readonly checkGroup: FieldInfo
  readonly select: SelectBaseField
  readonly multiSelect: FieldInfo
  readonly date: FieldInfo
  readonly dateRange: FieldInfo
  readonly dateTime: FieldInfo
  readonly textarea?: FieldInfo
  readonly textareaWithCounter: FieldInfo
  readonly tags: FieldInfo
  readonly seo: SeoData
  public fieldTranslations: FieldTranslationsData

  constructor(data) {
    this.id = data?.id
    this.switch = new FieldInfo({
      type: FieldType.Switch,
      key: 'switch',
      value: data?.switch,
      label: i18n.t('page.demo.switchField'),
    })
    this.text = new TextBaseField({
      key: 'text',
      value: data?.text,
      label: i18n.t('page.demo.textField'),
      validationRules: 'required',
      isLocalization: true,
    })
    this.number = new NumberBaseField({
      key: 'number',
      value: data?.number,
      label: i18n.t('page.demo.numberField'),
    })
    this.minute = new FieldInfo({
      type: FieldType.Minute,
      key: 'minute',
      value: data?.minute,
      label: i18n.t('page.demo.minuteField'),
    })
    this.percent = new FieldInfo({
      type: FieldType.Percent,
      key: 'percent',
      value: data?.percent,
      label: i18n.t('page.demo.percentField'),
    })
    this.sumRange = new FieldInfo({
      type: FieldType.SumRange,
      key: 'sumRange',
      value: data?.sumRange,
      label: i18n.t('page.demo.sumRangeField'),
    })
    this.phone = new FieldInfo({
      type: FieldType.Phone,
      key: 'phone',
      value: data?.phone,
      label: i18n.t('page.demo.phoneField'),
    })
    this.password = new FieldInfo({
      type: FieldType.Password,
      key: 'password',
      value: data?.password,
      label: i18n.t('page.demo.passwordField'),
    })
    this.switchWithState = new FieldInfo({
      type: FieldType.SwitchWithState,
      key: 'switchWithState',
      value: data?.switchWithState,
      label: i18n.t('page.demo.switchWithStateField'),
    })
    this.check = new FieldInfo({
      type: FieldType.Check,
      key: 'check',
      value: data?.check,
      label: i18n.t('page.demo.checkField'),
    })
    this.checkGroup = new FieldInfo({
      type: FieldType.CheckGroup,
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
      label: i18n.t('page.demo.radioField'),
      options: [
        { text: i18n.t('common.yes'), value: true },
        { text: i18n.t('common.no'), value: false },
      ],
    })
    this.date = new FieldInfo({
      type: FieldType.Date,
      key: 'date',
      value: getLocaleDateStringWithoutTimezone(data?.date),
      label: i18n.t('page.demo.dateField'),
    })
    this.dateRange = new FieldInfo({
      type: FieldType.DateRange,
      key: 'dateRange',
      value: data?.dateRange,
      label: i18n.t('page.demo.dateRangeField'),
    })
    this.dateTime = new FieldInfo({
      type: FieldType.DateTime,
      key: 'dateTime',
      value: getLocaleDateStringWithoutTimezone(data?.dateTime),
      label: i18n.t('page.demo.dateTimeField'),
    })
    this.select = new SelectBaseField({
      key: 'select',
      value: data?.select,
      label: i18n.t('page.demo.selectField'),
      fetchOptionsActionName: 'demo/fetchOptions',
    })
    this.multiSelect = new FieldInfo({
      type: FieldType.MultiSelect,
      key: 'multiSelect',
      value: data?.multiSelect,
      label: i18n.t('page.demo.multiSelectField'),
      fetchOptionsActionName: 'demo/fetchOptions',
    })
    this.textarea = new FieldInfo({
      type: FieldType.Textarea,
      value: data?.textarea,
      key: 'textarea',
      label: i18n.t('page.demo.textareaField'),
    })
    this.textareaWithCounter = new FieldInfo({
      type: FieldType.TextareaWithCounter,
      value: data?.textareaWithCounter,
      key: 'textareaWithCounter',
      label: i18n.t('page.demo.textareaWithCounterField'),
      maxLength: 45,
    })
    this.tags = new FieldInfo({
      type: FieldType.Tags,
      value: data?.tags,
      key: 'tags',
      label: i18n.t('page.demo.tagsField'),
    })
    this.seo = data?.seo
    this.fieldTranslations = data?.fieldTranslations
  }
}
