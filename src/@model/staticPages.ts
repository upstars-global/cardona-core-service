import type { SeoData } from '../@model/seo'
import { FieldInfo, FieldType } from '../@model/field'
import { t } from '../plugins/i18n'
import type { FieldTranslationsData } from '../@model/translations'

export interface StaticPagesData {
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
  readonly name: FieldInfo<string>
  readonly buttonName: FieldInfo<string>
  readonly slug: FieldInfo<string>
  readonly isActive: boolean
  readonly isHidden: FieldInfo<boolean>
  readonly position: FieldInfo<number>
  readonly imagePath?: string
  readonly localisationParameters?: Object
  readonly seo?: SeoData
  public games?: Array<IGameItemInfo>
  public fieldTranslations?: FieldTranslationsData

  constructor(data?: StaticPagesData) {
    this.id = data?.id
    this.isActive = data?.isActive || false
    this.name = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'name',
      value: data?.name || '',
      label: t('common.staticPages.name'),
      validationRules: 'required',
      isLocalization: true,
    })
    this.buttonName = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'buttonName',
      value: data?.buttonName || '',
      label: t('common.staticPages.buttonName'),
      isLocalization: true,
    })
    this.isHidden = new FieldInfo<boolean>({
      type: FieldType.Check,
      key: 'isHidden',
      value: data?.isHidden || false,
      label: t('common.staticPages.isHidden'),
      description: t('common.staticPages.isHiddenDescription'),
    })
    this.slug = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'slug',
      value: data?.slug || '',
      label: t('common.slug'),
      validationRules: 'required',
    })
    this.position = new FieldInfo<number>({
      type: FieldType.Number,
      key: 'position',
      value: data?.position || 1,
      label: t('common.order'),
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
