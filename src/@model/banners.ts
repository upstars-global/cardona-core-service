import i18n from '../libs/i18n'
import { OptionsItem } from '../@model/index'
import { FieldTranslationsData } from '../@model/translations'
import { BaseDatePeriod, IBaseDatePeriod } from '../@model/date'
import { FieldInfo, FieldType } from '../@model/field'
import { Strategy } from '../@model/strategy'

export interface IBannerListData {
  id: string
  name: string
  slug: string
  isActive: boolean
  startedAt: string
  endedAt: string
  position: number
  strategy: string
  buttonName: string
  buttonUrl: string
  imageFile: string
  imagePath: string
  types: Array<BannerType>
}

export interface IBannerData {
  project?: string
  id?: string
  name?: string
  slug?: string
  content?: string
  startedAt?: string
  endedAt?: string
  isActive?: boolean
  position?: number
  category?: string
  googleAnalyticsCategory?: string
  buttonUrl?: string
  buttonName?: string
  color?: string
  strategy?: string
  strategyParam?: string
  imagePath?: string
  imageFile?: string
  restrictedCountries?: string[]
  localisationParameters?: object
  fieldTranslations?: object
  types?: Array<BannerType>
}

export const BannerTypes = {
  Slider: 'slider',
  Promo: 'promo',
} as const

export type BannerType = (typeof BannerTypes)[keyof typeof BannerTypes]

export const typesOptions: Array<OptionsItem> = [
  { id: BannerTypes.Slider, name: i18n.t('page.banners.slider') as string },
  { id: BannerTypes.Promo, name: i18n.t('page.banners.promo') as string },
]

export class BannerInfo {
  id: string
  name: string
  slug: string
  isActive: boolean
  startedAt: string
  endedAt: string
  position: number
  strategy: string
  buttonName: string
  buttonUrl: string
  imageFile: string
  imagePath: string
  types: Array<OptionsItem>
  period: IBaseDatePeriod

  constructor(data: IBannerListData) {
    this.id = data.id
    this.name = data.name
    this.slug = data.slug
    this.isActive = data.isActive
    this.endedAt = data.endedAt
    this.startedAt = data.startedAt
    this.position = data.position
    this.strategy = i18n.t(`page.banners.keyStrategy.${data.strategy}`) as string
    this.buttonName = data.buttonName
    this.buttonUrl = data.buttonUrl
    this.imageFile = data.imageFile
    this.imagePath = `${data.imagePath}?ar=184`
    this.period = new BaseDatePeriod(data.startedAt, data.endedAt)
    this.types = data?.types.map(
      (type: BannerType) =>
        ({
          id: type,
          name: i18n.t(`page.banners.${type}`) as string,
        } as OptionsItem)
    )
  }
}

export class BannerData implements IBannerData {
  project?: string
  id?: string
  name?: string
  slug?: string
  content?: string
  startedAt?: string
  endedAt?: string
  isActive?: boolean
  position?: number
  category?: string
  googleAnalyticsCategory?: string
  buttonUrl?: string
  buttonName?: string
  color?: string
  strategy?: string
  strategyParam?: string
  imagePath?: string
  imageFile?: string
  restrictedCountries?: string[]
  localisationParameters?: object
  fieldTranslations?: object
  types: Array<BannerType>

  constructor(data?: IBannerData) {
    this.project = data?.project
    this.id = data?.id
    this.name = data?.name
    this.slug = data?.slug
    this.content = data?.content
    this.startedAt = data?.startedAt
    this.endedAt = data?.endedAt
    this.isActive = data?.isActive
    this.position = data?.position || 0
    this.category = data?.slug
    this.googleAnalyticsCategory = data?.googleAnalyticsCategory
    this.buttonUrl = data?.buttonUrl
    this.buttonName = data?.buttonName
    this.color = data?.color
    this.strategy = data?.strategy || Strategy.SHOW_ALWAYS
    this.strategyParam = data?.strategyParam
    this.imagePath = data?.imagePath
    this.imageFile = data?.imageFile
    this.fieldTranslations = data?.fieldTranslations || ({} as FieldTranslationsData)
    this.restrictedCountries = data?.restrictedCountries || []
    this.localisationParameters = data?.localisationParameters || {}
    this.types = data?.types || [BannerTypes.Slider]
  }
}

const baseColorFiled = {
  type: FieldType.Text,
  key: 'color',
  value: '',
  label: i18n.t('page.banners.backgroundColor') as string,
}

export const colorField = {
  ...baseColorFiled,
  prepend: '#',
}

export const gradientColorField = {
  ...baseColorFiled,
  type: FieldType.Textarea,
  label: i18n.t('page.banners.backgroundColorGrad') as string,
}

export class BannerForm {
  readonly id?: string
  readonly project?: string
  readonly name: FieldInfo<string>
  readonly slug?: FieldInfo<string>
  readonly content?: FieldInfo<string>
  readonly startedAt?: string | Date
  readonly endedAt?: string | Date
  readonly isActive?: FieldInfo<boolean>
  readonly position?: FieldInfo<number>
  readonly googleAnalyticsCategory?: FieldInfo<string>
  readonly buttonUrl?: FieldInfo<string>
  readonly buttonName?: FieldInfo<string>
  public color?: FieldInfo<string>
  readonly isUseGradient?: FieldInfo<boolean>
  readonly strategy?: FieldInfo<string>
  readonly strategyParam?: FieldInfo<string>
  readonly imagePath?: string
  readonly restrictedCountries?: Array<string>
  readonly localisationParameters: object
  readonly fieldTranslations: FieldTranslationsData
  readonly types?: FieldInfo<Array<string>>

  constructor(data?: IBannerData) {
    const isGradient = !(data?.color && data.color?.startsWith('#'))
    this.id = data?.id
    this.name = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'name',
      value: data?.name,
      label: i18n.t('common.banners.name') as string,
      validationRules: 'required',
    })
    this.slug = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'slug',
      value: data?.slug,
      label: i18n.t('common.banners.slug') as string,
      validationRules: 'required',
    })
    this.content = new FieldInfo<string>({
      type: FieldType.RichText,
      key: 'content',
      value: data?.content || '',
      label: i18n.t('common.banners.content') as string,
      isLocalization: true,
      form: data,
    })
    this.startedAt = data?.startedAt
    this.endedAt = data?.endedAt
    this.isActive = new FieldInfo<boolean>({
      type: FieldType.Switch,
      key: 'isActive',
      value: data?.isActive,
      label: i18n.t('userStatuses.active') as string,
    })
    this.position = new FieldInfo<number>({
      type: FieldType.Number,
      key: 'position',
      value: data?.position || 1,
      label: i18n.t('common.priority') as string,
      validationRules: 'required',
    })
    this.googleAnalyticsCategory = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'googleAnalyticsCategory',
      value: data?.googleAnalyticsCategory,
      label: i18n.t('page.banners.googleEventCategory') as string,
    })
    this.buttonUrl = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'buttonUrl',
      value: data?.buttonUrl,
      label: i18n.t('common.banners.buttonUrl') as string,
      validationRules: 'required',
    })
    this.buttonName = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'buttonName',
      value: data?.buttonName,
      label: i18n.t('common.banners.buttonName') as string,
      validationRules: 'required',
      isLocalization: true,
    })
    this.color = new FieldInfo<string>(
      isGradient
        ? { ...gradientColorField, value: data?.color }
        : { ...colorField, value: data?.color }
    )

    this.isUseGradient = new FieldInfo<boolean>({
      type: FieldType.Check,
      key: 'isUseGradient',
      value: isGradient,
      label: i18n.t('page.banners.useGradient') as string,
    })
    this.strategy = new FieldInfo<string>({
      type: FieldType.Select,
      key: 'strategy',
      value: {
        id: data?.strategy || 'SHOW_ALWAYS',
        name: data?.strategy
          ? (i18n.t(`page.banners.keyStrategy.${data?.strategy}`) as string)
          : (i18n.t('page.banners.keyStrategy.SHOW_ALWAYS') as string),
      },
      label: i18n.t('page.banners.show') as string,
      fetchOptionsActionName: 'banner/fetchBannersStrategy',
    })
    this.strategyParam = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'buttonName',
      value: data?.strategyParam,
      label: i18n.t('common.banners.buttonName') as string,
      validationRules: 'required',
    })
    this.imagePath = data?.imagePath || ''
    this.restrictedCountries = data?.restrictedCountries
    this.types = new FieldInfo<Array<string>>({
      type: FieldType.CheckGroup,
      key: 'types',
      value: data?.types || [typesOptions[0].id],
      label: i18n.t('page.banners.bannerType') as string,
      options: typesOptions,
      validationRules: 'required',
    })
    this.fieldTranslations =
      (data?.fieldTranslations as FieldTranslationsData) || ({} as FieldTranslationsData)
    this.localisationParameters = data?.localisationParameters || {}
  }
}

// Banner strategy
export class BannerStrategyList {
  readonly list: Array<OptionsItem>

  constructor({ data }) {
    this.list = data.strategies.map(
      (strategy) =>
        ({
          id: strategy,
          name: i18n.t(`page.banners.keyStrategy.${strategy}`),
        } as OptionsItem)
    )
  }
}

// Banner filter
export interface IBannerRequestFilters {
  readonly search?: string
  readonly isActive?: boolean
  readonly strategy?: string
  readonly startAt?: string
  readonly endAt?: string
  readonly types?: Array<BannerType>
}

export class BannerRequestFilters {
  readonly search?: string
  readonly isActive?: boolean
  readonly strategy?: string
  readonly startAt?: string
  readonly endAt?: string
  readonly types?: Array<BannerType>

  constructor({ search, isActive, strategy, startAt, endAt, types }: IBannerRequestFilters) {
    this.search = search
    this.isActive = isActive
    this.strategy = strategy
    this.startAt = startAt
    this.endAt = endAt
    this.types = types
  }
}
