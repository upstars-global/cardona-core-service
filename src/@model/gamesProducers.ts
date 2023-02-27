import { SeoData } from '@model/seo'
import { FieldInfo, FieldType } from '@model/field'
import i18n from '@/libs/i18n'
import { IRequestListPayload, OptionsItem } from '@model/index'
import { getters } from '@/store'
import { FieldTranslationsData } from '@model/translations'

export type GamesProducersData = {
  readonly id: string
  readonly name: string
  readonly slug: string
  readonly path: string
  readonly position: number
  readonly gamesCount: number
  readonly imagePath: string
  readonly isActive: boolean
  readonly isNew: boolean
  readonly styles: object
  readonly availableDomains: Array<string>
  readonly currencies: string[]
  readonly localisationParameters: object
  readonly seo: SeoData
  readonly fieldTranslations: any
  readonly restrictedCountries: Array<string>
  games: Array<GameItemInfo>
}

// List
export class GamesProducersListItem {
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
export interface IGamesProducersListPayload extends IRequestListPayload {
  readonly filter?: IGamesProducersFilters
}

interface GameItemInfo {
  readonly gameId: string
  readonly position: number
}

export class GamesProducersForm {
  readonly id?: string
  readonly name: FieldInfo<string>
  readonly slug: FieldInfo<string>
  readonly path: FieldInfo<string>
  readonly isActive: boolean
  readonly position: FieldInfo<number>
  readonly imagePath?: string
  readonly localisationParameters?: Object
  readonly availableDomains?: Array<FieldInfo<string>>
  readonly seo?: SeoData
  readonly isNew: FieldInfo<boolean>
  public currencies: FieldInfo<string[]>
  public games?: Array<GameItemInfo>
  public fieldTranslations?: any
  readonly restrictedCountries: Array<string>

  constructor(data?: GamesProducersData) {
    this.id = data?.id
    this.isActive = data?.isActive || false
    this.currencies = new FieldInfo<string[]>({
      type: FieldType.CheckGroup,
      key: 'currencies',
      value: data?.currencies || [],
      options: getters['appConfig/allCurrencies'].map(
        (item) => <OptionsItem>{ id: item, name: item }
      ),
      label: String(i18n.t('common.producers.currencies.label')),
      description: String(i18n.t('common.producers.currencies.description')),
    })
    this.isNew = new FieldInfo<boolean>({
      type: FieldType.Check,
      key: 'isNew',
      value: data?.isNew,
      label: String(i18n.t('common.producers.isNew')),
    })
    this.name = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'name',
      value: data?.name || '',
      label: String(i18n.t('common.producers.name')),
      validationRules: 'required',
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
      label: String(i18n.t('common.producers.url')),
      validationRules: 'required',
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
    this.restrictedCountries = data?.restrictedCountries || []
    this.availableDomains = data?.availableDomains.isNotEmpty
      ? data.availableDomains.map(
          (domain: string): FieldInfo<string> => createDomainFieldItem(domain)
        )
      : [createDomainFieldItem()]
  }
}

const createDomainFieldItem = (domain?: string): FieldInfo<string> =>
  new FieldInfo<string>({
    type: FieldType.Text,
    value: domain,
    key: 'domain',
    label: String(i18n.t('page.games.allowedDomains')),
    placeholder: String(i18n.t('page.games.allowedDomainsPlaceholder')),
    info: String(i18n.t('page.games.allowedDomainsInfo')),
  })

// Filters
interface IGamesProducersFilters {
  readonly search?: string
  readonly name?: string
  readonly slug?: string
  readonly isActive?: boolean
  readonly createdFrom?: string
  readonly createdTo?: string
  readonly updatedFrom?: string
  readonly updatedTo?: string
}

export class GamesProducersFilters implements IGamesProducersFilters {
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
  }: IGamesProducersFilters) {
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
