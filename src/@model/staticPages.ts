import { SeoData } from '../@model/seo'
import { FieldInfo, FieldType } from '../@model/field'
import i18n from '../libs/i18n'
import { NumberBaseField, TextBaseField } from '../@model/baseField'
import { FieldTranslationsData } from '../@model/translations'

export type StaticPagesData = {
  readonly id: string
  readonly name: string
  readonly buttonName: string
  readonly slug: string
  readonly path: string
  readonly position: number
  readonly gamesCount: number
  readonly isActive: boolean
  readonly isHidden: boolean
  readonly styles: object
  readonly localisationParameters: object
  readonly seo: SeoData
  readonly fieldTranslations: FieldTranslationsData
  games: Array<IGameItemInfo>
}

// List
export interface IGameItemInfo {
  readonly gameId: string
  readonly position: number
}

export class StaticPagesForm {
  readonly id?: string
  readonly name: TextBaseField
  readonly buttonName: TextBaseField
  readonly slug: TextBaseField
  readonly isActive: boolean
  readonly isHidden: FieldInfo<boolean>
  readonly position: NumberBaseField
  readonly imagePath?: string
  readonly localisationParameters?: Object
  readonly seo?: SeoData
  public games?: Array<IGameItemInfo>
  public fieldTranslations?: FieldTranslationsData

  constructor(data?: StaticPagesData) {
    this.id = data?.id
    this.isActive = data?.isActive || false
    this.name = new TextBaseField({
      key: 'name',
      value: data?.name,
      label: i18n.t('common.staticPages.name'),
      validationRules: 'required',
      isLocalization: true,
    })
    this.buttonName = new TextBaseField({
      key: 'buttonName',
      value: data?.buttonName,
      label: i18n.t('common.staticPages.buttonName'),
      isLocalization: true,
    })
    this.isHidden = new FieldInfo<boolean>({
      type: FieldType.Check,
      key: 'isHidden',
      value: data?.isHidden || false,
      label: String(i18n.t('common.staticPages.isHidden')),
      description: String(i18n.t('common.staticPages.isHiddenDescription')),
    })
    this.slug = new TextBaseField({
      key: 'slug',
      value: data?.slug,
      label: i18n.t('common.slug'),
      validationRules: 'required',
    })
    this.position = new NumberBaseField({
      key: 'position',
      value: data?.position || 1,
      label: i18n.t('common.order'),
      validationRules: 'required',
    })
    this.seo = data?.seo
    this.games = data?.games
    this.localisationParameters = data?.localisationParameters || {}
    this.fieldTranslations = data?.fieldTranslations || ({} as FieldTranslationsData)
  }
}

// Filters
interface IStaticPagesFilters {
  readonly search?: string
  readonly isHidden?: boolean
  readonly isActive?: boolean
  readonly createdFrom?: string
  readonly createdTo?: string
  readonly updatedFrom?: string
  readonly updatedTo?: string
}

export class StaticPagesFilters implements IStaticPagesFilters {
  readonly search?: string
  readonly isHidden?: boolean
  readonly isActive?: boolean
  readonly createdFrom?: string
  readonly createdTo?: string
  readonly updatedFrom?: string
  readonly updatedTo?: string

  constructor({
    search,
    isHidden,
    isActive,
    createdFrom,
    createdTo,
    updatedFrom,
    updatedTo,
  }: IStaticPagesFilters) {
    this.search = search
    this.isHidden = isHidden
    this.isActive = isActive
    this.createdFrom = createdFrom
    this.createdTo = createdTo
    this.updatedFrom = updatedFrom
    this.updatedTo = updatedTo
  }
}
