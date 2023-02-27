import i18n from '@/libs/i18n'
import { SeoData } from '@model/seo'
import { FieldType, FieldInfo } from '@model/field'
import { IRequestListPayload } from '@model/index'
import { FieldTranslationsData } from '@model/translations'

interface GameItemInfo {
  readonly gameId: string
  readonly position: number
}

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
  games: Array<GameItemInfo>
  fieldTranslations: any
}

export class GamesCategoriesForm {
  readonly id?: string
  readonly name: FieldInfo<string>
  readonly slug: FieldInfo<string>
  readonly path: FieldInfo<string>
  readonly isActive: boolean
  readonly position: FieldInfo<number>
  readonly imagePath: string
  readonly localisationParameters?: object
  readonly seo?: SeoData
  public games?: Array<GameItemInfo>
  public fieldTranslations?: any

  constructor(data?: GamesCategoriesData) {
    this.id = data?.id
    this.isActive = data?.isActive || false
    this.name = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'name',
      value: data?.name || '',
      label: String(i18n.t('common.category.name')),
      validationRules: 'required',
      isLocalization: true,
    })
    this.slug = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'slug',
      value: data?.slug || '',
      label: String(i18n.t('common.slug')),
      validationRules: 'required',
    })
    this.path = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'path',
      value: data?.path || '',
      label: String(i18n.t('common.category.url')),
    })
    this.position = new FieldInfo<number>({
      type: FieldType.Number,
      key: 'position',
      value: data?.position || 1,
      label: String(i18n.t('common.order')),
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
