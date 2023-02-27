import i18n from '@/libs/i18n'
import { FieldInfo, FieldType } from '@model/field'
import { IRequestListPayload, OptionsItem } from '@model/index'
import { SeoData } from '@model/seo'
import { FieldTranslationsData } from '@model/translations'
import { GamesCategoriesData } from '@model/gamesCategories'
import { GamesProducersData } from '@model/gamesProducers'

export type GamesData = {
  readonly id: string
  readonly name: string
  readonly slug: string
  readonly runner: string
  readonly desktopKey: string
  readonly mobileKey: string
  readonly type: string
  readonly isActive: boolean
  readonly isDemoMode: boolean
  readonly wageringBonusRatio: number
  readonly isAvailableWithBonuses: boolean
  readonly isGameOnBonuses: boolean
  readonly isIFrame: boolean
  readonly imagePath: string
  readonly decreaseRatio: number
  readonly playsonMobileGameId: string
  readonly playsonDesktopGameId: string
  readonly pragmaticLiveTableId: string
  readonly localisationParameters: object
  readonly categories: Array<GamesCategoriesData>
  readonly producer: Array<GamesProducersData>
  readonly seo: SeoData
  readonly fieldTranslations: FieldTranslationsData
  readonly restrictedCountries: Array<string>
  readonly aliases: Array<string>
}

type CategoryFieldItem = {
  id: FieldInfo<OptionsItem>
  position: FieldInfo<number>
}

export class GamesForm {
  readonly id?: string
  readonly isActive?: boolean
  readonly imagePath: string
  readonly name: FieldInfo<string>
  readonly slug: FieldInfo<string>
  readonly desktopKey: FieldInfo<string>
  readonly mobileKey: FieldInfo<string>
  readonly playsonDesktopGameId: FieldInfo<string>
  readonly playsonMobileGameId: FieldInfo<string>
  readonly pragmaticLiveTableId: FieldInfo<string>
  readonly wageringBonusRatio: FieldInfo<number>
  readonly decreaseRatio: FieldInfo<number>
  readonly isGameOnBonuses: FieldInfo<boolean>
  readonly isAvailableWithBonuses: FieldInfo<boolean>
  readonly isDemoMode: FieldInfo<boolean>
  readonly isIFrame: FieldInfo<boolean>
  readonly runner: FieldInfo<OptionsItem>
  readonly type: FieldInfo<OptionsItem>
  readonly producerId: FieldInfo<GamesProducersData>
  readonly categories: Array<CategoryFieldItem>
  readonly seo?: SeoData
  readonly fieldTranslations?: FieldTranslationsData
  readonly localisationParameters?: object
  readonly restrictedCountries: Array<string>
  readonly aliases: FieldInfo<Array<string>>

  constructor(data?: GamesData) {
    this.id = data?.id
    this.isActive = data?.isActive
    this.imagePath = data?.imagePath || ''
    this.name = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'name',
      value: data?.name,
      label: String(i18n.t('common.game.name')),
      validationRules: 'required',
    })
    this.slug = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'slug',
      value: data?.slug,
      label: String(i18n.t('common.slug')),
      validationRules: 'required',
    })
    this.desktopKey = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'desktopKey',
      value: data?.desktopKey,
      label: String(i18n.t('page.games.desktopKey')),
      validationRules: 'required',
    })
    this.mobileKey = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'mobileKey',
      value: data?.mobileKey,
      label: String(i18n.t('page.games.mobileKey')),
      validationRules: 'required',
    })
    this.playsonDesktopGameId = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'playsonDesktopGameId',
      value: data?.playsonDesktopGameId,
      label: String(i18n.t('page.games.playsonDesktopGameId')),
    })
    this.playsonMobileGameId = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'playsonMobileGameId',
      value: data?.playsonMobileGameId,
      label: String(i18n.t('page.games.playsonMobileGameId')),
    })
    this.pragmaticLiveTableId = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'pragmaticLiveTableId',
      value: data?.pragmaticLiveTableId,
      label: String(i18n.t('page.games.pragmaticLiveTableId')),
    })
    this.wageringBonusRatio = new FieldInfo<number>({
      type: FieldType.Percent,
      key: 'wageringBonusRatio',
      value: data?.wageringBonusRatio,
      label: String(i18n.t('page.games.wageringBonusRatioFull')),
      validationRules: 'required',
      placeholder: '100',
    })
    this.decreaseRatio = new FieldInfo<number>({
      type: FieldType.Number,
      key: 'decreaseRatio',
      value: data?.decreaseRatio,
      label: String(i18n.t('page.games.decreaseRatio')),
      validationRules: 'required',
      description: String(i18n.t('page.games.decreaseRatioDescription')),
      placeholder: '1',
    })
    this.isGameOnBonuses = new FieldInfo<boolean>({
      type: FieldType.Check,
      key: 'isGameOnBonuses',
      value: data?.isGameOnBonuses,
      label: String(i18n.t('page.games.gameForBonuses')),
      description: String(i18n.t('page.games.gameForBonusesDescription')),
    })
    this.isAvailableWithBonuses = new FieldInfo<boolean>({
      type: FieldType.Check,
      key: 'isAvailableWithBonuses',
      value: data?.isAvailableWithBonuses,
      label: String(i18n.t('page.games.availableWithBonuses')),
      description: String(i18n.t('page.games.availableWithBonusesDescription')),
    })
    this.isDemoMode = new FieldInfo<boolean>({
      type: FieldType.Check,
      key: 'isDemoMode',
      value: data?.isDemoMode,
      label: String(i18n.t('page.games.demoMode')),
    })
    this.isIFrame = new FieldInfo<boolean>({
      type: FieldType.Check,
      key: 'isIFrame',
      value: data?.isIFrame,
      label: String(i18n.t('page.games.IFrame')),
      description: String(i18n.t('page.games.IFrameDescription')),
    })
    this.runner = new FieldInfo<OptionsItem>({
      type: FieldType.Select,
      key: 'runner',
      validationRules: 'required',
      value: data?.runner,
      label: String(i18n.t('page.games.runner')),
      fetchOptionsActionName: 'games/fetchGamesRunners',
    })
    this.type = new FieldInfo<OptionsItem>({
      type: FieldType.Select,
      key: 'type',
      label: String(i18n.t('common.type')),
      validationRules: 'required',
      value: data?.type,
      fetchOptionsActionName: 'games/fetchGamesTypes',
    })
    this.producerId = new FieldInfo<GamesProducersData>({
      type: FieldType.Select,
      key: 'producerId',
      value: data?.producer,
      label: String(i18n.t('common.producer._')),
      fetchOptionsActionName: 'gamesProducers/fetchGamesProducersList',
    })
    this.aliases = new FieldInfo<Array<string>>({
      type: FieldType.Tags,
      key: 'aliases',
      value: data?.aliases,
      label: String(i18n.t('page.games.aliases')),
      placeholder: String(i18n.t('page.games.aliasesPlaceholder')),
    })
    this.seo = data?.seo
    this.fieldTranslations = data?.fieldTranslations || ({} as FieldTranslationsData)
    this.localisationParameters = data?.localisationParameters || {}
    this.restrictedCountries = data?.restrictedCountries || []
    this.categories = data?.categories.isNotEmpty
      ? data.categories.map(
          (category: GamesCategoriesData): CategoryFieldItem => createCategoryFieldItem(category)
        )
      : [createCategoryFieldItem()]
  }
}

const createCategoryFieldItem = (category?: GamesCategoriesData): CategoryFieldItem => ({
  id: new FieldInfo<OptionsItem>({
    type: FieldType.DummySelect,
    key: 'id',
    value: category,
    label: String(i18n.t('common.category._')),
    fetchOptionsActionName: 'gamesCategories/fetchGamesCategoriesList',
  }),
  position: new FieldInfo<number>({
    type: FieldType.Number,
    key: 'position',
    value: category?.position,
    label: String(i18n.t('page.games.categoryGamePriority')),
    placeholder: '1',
  }),
})

// List
export interface IGamesListPayload extends IRequestListPayload {
  readonly filter?: IGamesFilters
}

export type GamesListItem = {
  readonly id: string
  readonly name: string
  readonly slug: string
  readonly isActive: boolean
  readonly runner: string
  readonly producer: string
  readonly wageringBonusRatio: number
  readonly type: string
  readonly isAvailableWithBonuses: boolean
  readonly isGameOnBonuses: boolean
  readonly updatedAt: string
}

export class GamesListItemCard {
  readonly id: string
  readonly name: string
  readonly position: number
  readonly slug: string

  constructor({ id, name, position, slug }) {
    this.id = id
    this.name = name
    this.position = position
    this.slug = slug
  }
}

// Filters
export interface IGamesFilters {
  readonly id?: string
  readonly slug?: string
  readonly producerNames?: Array<string>
  readonly categoryNames?: Array<string>
  readonly name?: string
  readonly type?: string
  readonly isActive?: boolean
  readonly runner?: string
  readonly isGameByBonuses?: boolean
  readonly isGameAvailableByBonuses?: boolean
  readonly slugs?: Array<string>
  readonly search?: string
  readonly updatedFrom?: string
  readonly updatedTo?: string
}

export class GamesFilters implements IGamesFilters {
  readonly search?: string
  readonly type?: string
  readonly categoryNames?: Array<string>
  readonly producerNames?: Array<string>
  readonly isActive?: boolean
  readonly runner?: string
  readonly isGameByBonuses?: boolean
  readonly isGameAvailableByBonuses?: boolean
  readonly updatedFrom?: string
  readonly updatedTo?: string

  constructor({
    search,
    type,
    categoryNames,
    producerNames,
    isActive,
    runner,
    isGameByBonuses,
    isGameAvailableByBonuses,
    updatedFrom,
    updatedTo,
  }: IGamesFilters) {
    this.search = search
    this.type = type
    this.categoryNames = categoryNames
    this.producerNames = producerNames
    this.isActive = isActive
    this.runner = runner
    this.isGameByBonuses = isGameByBonuses
    this.isGameAvailableByBonuses = isGameAvailableByBonuses
    this.updatedFrom = updatedFrom
    this.updatedTo = updatedTo
  }
}

//gamesSection
export enum GameActionType {
  Add = 'add',
  Update = 'upd',
  Delete = 'del',
}
export interface IGamesSectionGamesListPayload extends IRequestListPayload {
  readonly filter?: IGamesSectionGamesFilters
}

export type IGamesSectionGamesFilters = {
  readonly search: string
  readonly id: string
}

export class EnabledGamesFilters {
  readonly search?: string
  readonly id: string

  constructor({ search, id }: IGamesSectionGamesFilters) {
    this.search = search
    this.id = id
  }
}

export type GamesSectionGamesItem = {
  readonly id: string
  readonly name?: string
  readonly position?: number
  readonly type?: GameActionType
}
