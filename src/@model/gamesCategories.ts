import i18n from '../libs/i18n'
import { SeoData } from '../@model/seo'
import { IRequestListPayload } from '../@model/index'
import { FieldTranslationsData } from '../@model/translations'
import { IGameItemInfo } from '../@model/staticPages'
import { TextBaseField, NumberBaseField } from '../@model/baseField'

export interface GamesCategoriesData {
  readonly id?: string
  readonly isActive: boolean
  readonly name: string
  readonly slug: string
  readonly path: string
  readonly position: number
  readonly imagePath?: string
  readonly localisationParameters: object
  seo: SeoData
  games: Array<IGameItemInfo>
  fieldTranslations: any
}

export class GamesCategoriesForm {
  readonly id?: string
  readonly name: TextBaseField
  readonly slug: TextBaseField
  readonly path: TextBaseField
  readonly isActive: boolean
  readonly position: NumberBaseField
  readonly imagePath: string
  readonly localisationParameters?: object
  readonly seo?: SeoData
  public games?: Array<IGameItemInfo>
  public fieldTranslations?: any

  constructor(data?: GamesCategoriesData) {
    this.id = data?.id
    this.isActive = data?.isActive || false
    this.name = new TextBaseField({
      key: 'name',
      value: data?.name,
      label: i18n.t('common.category.name'),
      validationRules: 'required',
      isLocalization: true,
    })
    this.slug = new TextBaseField({
      key: 'slug',
      value: data?.slug,
      label: i18n.t('common.slug'),
      validationRules: 'required',
    })
    this.path = new TextBaseField({
      key: 'path',
      value: data?.path,
      label: i18n.t('common.category.url'),
    })
    this.position = new NumberBaseField({
      key: 'position',
      value: data?.position || 1,
      label: i18n.t('common.order'),
    })
    this.imagePath = data?.imagePath || ''
    this.seo = data?.seo
    this.games = data?.games
    this.localisationParameters = data?.localisationParameters || {}
    this.fieldTranslations = data?.fieldTranslations || ({} as FieldTranslationsData)
  }
}

// Game category list
export interface IGamesCategoriesListPayload extends IRequestListPayload {
  readonly filter?: IGamesCategoriesFilters
}

export type GamesCategoriesListItem = {
  readonly id: string
  readonly name: string
  readonly slug: string
  readonly gamesCount: number
  readonly isActive: boolean
  readonly createdAt: string
  readonly updatedAt: string
}

// Filters
interface IGamesCategoriesFilters {
  readonly search?: string
  readonly name?: string
  readonly slug?: string
  readonly isActive?: boolean
  readonly createdFrom?: string
  readonly createdTo?: string
  readonly updatedFrom?: string
  readonly updatedTo?: string
}

export class GamesCategoriesFilters implements IGamesCategoriesFilters {
  readonly search?: string
  readonly name?: string
  readonly slug?: string
  readonly isActive?: boolean
  readonly createdFrom?: string
  readonly createdTo?: string
  readonly updatedFrom?: string
  readonly updatedTo?: string

  constructor({
    search,
    name,
    slug,
    isActive,
    createdFrom,
    createdTo,
    updatedFrom,
    updatedTo,
  }: IGamesCategoriesFilters) {
    this.search = search
    this.name = name
    this.slug = slug
    this.isActive = isActive
    this.createdFrom = createdFrom
    this.createdTo = createdTo
    this.updatedFrom = updatedFrom
    this.updatedTo = updatedTo
  }
}
