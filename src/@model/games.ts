import { IRequestListPayload } from '.'

// List
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
  readonly tagNames?: Array<string>
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
  readonly tagNames?: Array<string>

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
    tagNames,
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
    this.tagNames = tagNames
  }
}
