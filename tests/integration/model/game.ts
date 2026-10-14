import type { SeoData } from '../../../src/@model/seo'
import type { TranslationForm } from '../../../src/@model/translations'
import type { Badge, IRequestListPayload } from '../../../src/@model'
import { ViewInfo, ViewType } from '../../../src/@model/view'
import { i18n } from '../../../src/plugins/i18n'

export interface GamesData {
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
  readonly pragmaticLiveTableId: string
  readonly localisationParameters: object
  readonly categories: Array<string>
  readonly producer: Pick<string, 'id' | 'name' | 'slug'>
  readonly seo: SeoData
  readonly fieldTranslations: TranslationForm
  readonly restrictedCountries: Array<string>
  readonly aliases: Array<string>
  readonly tags: Array<string>
  readonly comment: string
}

// List
export interface IGamesListPayload extends IRequestListPayload {
  readonly filter?: IGamesFilters
}

export interface GamesListItem {
  readonly id: string
  readonly name: string
  readonly imagePath: string
  readonly slug: string
  readonly isActive: boolean
  readonly runner: string
  readonly producer: string
  readonly wageringBonusRatio: number
  readonly type: string
  readonly categories: IGameCategory[]
  readonly isAvailableWithBonuses: boolean
  readonly isGameOnBonuses: boolean
  readonly createdAt: string
  readonly updatedAt: string
  readonly tags: Array<Badge>
  readonly decreaseRatio: number
}

interface IGameCategory {
  readonly id: string
  readonly name: string
  readonly slug: string
}

export class GameListItem {
  readonly id: string
  readonly isActive: boolean
  readonly isAvailableWithBonuses: boolean
  readonly isGameOnBonuses: boolean
  readonly name: string
  readonly image: { imagePath: string; id: string; compressionForPreview: number }
  readonly producer: string
  readonly runner: string
  readonly slug: string
  readonly type: string
  readonly categories: IGameCategory[]
  readonly createdAt: string
  readonly updatedAt: string
  readonly wageringBonusRatio: number
  readonly tags: Array<Badge>
  readonly decreaseRatio: number

  constructor(data: GamesListItem) {
    this.id = data.id
    this.isActive = data.isActive
    this.isAvailableWithBonuses = data.isAvailableWithBonuses
    this.isGameOnBonuses = data.isGameOnBonuses
    this.name = data.name
    this.image = {
      imagePath: data.imagePath || '',
      id: data.id,
      compressionForPreview: 45,
    }
    this.producer = data.producer
    this.runner = data.runner
    this.slug = data.slug
    this.type = data.type
    this.categories = data.categories
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.wageringBonusRatio = data.wageringBonusRatio
    this.tags = data.tags
    this.decreaseRatio = data.decreaseRatio
  }
}

export class GamesSideBarFields {
  readonly id: ViewInfo
  readonly isActive: ViewInfo
  readonly name: ViewInfo
  readonly slug: ViewInfo
  readonly runner: ViewInfo
  readonly producer: ViewInfo
  readonly type: ViewInfo
  readonly categories: ViewInfo
  readonly decreaseRatio: ViewInfo
  readonly wageringBonusRatio: ViewInfo
  readonly isGameOnBonuses: ViewInfo
  readonly isAvailableWithBonuses: ViewInfo
  readonly tags: ViewInfo
  readonly createdAt: ViewInfo
  readonly updatedAt: ViewInfo

  constructor(data?: GameListItem) {
    this.id = new ViewInfo({
      type: ViewType.BadgeCopy,
      value: data?.id,
      label: i18n.t('common.id'),
    })
    this.isActive = new ViewInfo({
      type: ViewType.Status,
      value: data?.isActive,
      label: i18n.t('common.status'),
    })
    this.name = new ViewInfo({
      type: ViewType.Text,
      value: data?.name,
      label: i18n.t('page.games.name'),
    })
    this.slug = new ViewInfo({
      type: ViewType.Text,
      value: data?.slug,
      label: i18n.t('common.slug'),
    })
    this.runner = new ViewInfo({
      type: ViewType.Text,
      value: data?.runner,
      label: i18n.t('page.games.runner'),
    })
    this.producer = new ViewInfo({
      type: ViewType.Text,
      value: data?.producer,
      label: i18n.t('title.gamesProducers._'),
    })
    this.type = new ViewInfo({
      type: ViewType.Text,
      value: data?.type,
      label: i18n.t('common.type'),
    })
    this.categories = new ViewInfo({
      type: ViewType.Badges,
      value: data?.categories,
      label: i18n.t('page.games.categoriesListCount', { count: data?.categories?.length }),
    })
    this.decreaseRatio = new ViewInfo({
      type: ViewType.Text,
      value: data?.decreaseRatio,
      label: i18n.t('page.games.decreaseRatio'),
    })
    this.wageringBonusRatio = new ViewInfo({
      type: ViewType.Text,
      value: `${data?.wageringBonusRatio}%`,
      label: i18n.t('page.games.wageringBonusRatio'),
    })
    this.isGameOnBonuses = new ViewInfo({
      type: ViewType.Statement,
      value: data?.isGameOnBonuses,
      label: i18n.t('page.games.gameForBonuses'),
    })
    this.isAvailableWithBonuses = new ViewInfo({
      type: ViewType.Statement,
      value: data?.isAvailableWithBonuses,
      label: i18n.t('page.games.availableWithBonuses'),
    })
    this.tags = new ViewInfo({
      type: ViewType.Badges,
      value: data?.tags,
      label: i18n.t('page.games.tagsListCount', { count: data?.tags?.length }),
    })
    this.createdAt = new ViewInfo({
      type: ViewType.Date,
      value: data?.createdAt,
      label: i18n.t('common.created'),
    })
    this.updatedAt = new ViewInfo({
      type: ViewType.Date,
      value: data?.updatedAt,
      label: i18n.t('common.updated'),
    })
  }
}

export type GamesShortInfo = Pick<GamesListItem, 'id' | 'name' | 'slug'> & { position?: number; isLock?: boolean }

// Filters
export interface IGamesFilters {
  readonly id?: string
  readonly slug?: string
  readonly producerNames?: Array<string>
  readonly excludeProducerNames?: Array<string>
  readonly categoryNames?: Array<string>
  readonly name?: string
  readonly types?: Array<string>
  readonly isActive?: boolean
  readonly runner?: string
  readonly isGameByBonuses?: boolean
  readonly isGameAvailableByBonuses?: boolean
  readonly slugs?: Array<string>
  readonly search?: string
  readonly createdFrom?: string
  readonly createdTo?: string
  readonly updatedFrom?: string
  readonly updatedTo?: string
  readonly tagNames?: Array<string>
}

export class GamesFilters implements IGamesFilters {
  readonly search?: string
  readonly types?: Array<string>
  readonly categoryNames?: Array<string>
  readonly producerNames?: Array<string>
  readonly excludeProducerNames?: Array<string>
  readonly isActive?: boolean
  readonly runner?: string
  readonly isGameByBonuses?: boolean
  readonly isGameAvailableByBonuses?: boolean
  readonly createdFrom?: string
  readonly createdTo?: string
  readonly updatedFrom?: string
  readonly updatedTo?: string
  readonly tagNames?: Array<string>

  constructor({
    search,
    types,
    categoryNames,
    producerNames,
    excludeProducerNames,
    isActive,
    runner,
    isGameByBonuses,
    isGameAvailableByBonuses,
    createdFrom,
    createdTo,
    updatedFrom,
    updatedTo,
    tagNames,
  }: IGamesFilters) {
    this.search = search
    this.types = types
    this.categoryNames = categoryNames
    this.producerNames = producerNames
    this.excludeProducerNames = excludeProducerNames
    this.isActive = isActive
    this.runner = runner
    this.isGameByBonuses = isGameByBonuses
    this.isGameAvailableByBonuses = isGameAvailableByBonuses
    this.createdFrom = createdFrom
    this.createdTo = createdTo
    this.updatedFrom = updatedFrom
    this.updatedTo = updatedTo
    this.tagNames = tagNames
  }
}
