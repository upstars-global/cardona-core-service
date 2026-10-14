import '../unit/mocks/base-list/static-mock'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BaseListConfig } from '../../src/@model/templates/baseList'
import { SelectMode } from '../../src/@model/enums/selectMode'
import { FilterType } from '../../src/@model/filter'
import { getMountComponent, global, mockCustomStore } from '../unit/mocks/base-list/utils'
import { useGamesList } from './useSection'

vi.mock('../../src/stores/filtersCore', () => ({
  useFiltersStore: () => ({
    isExistsEntityDefaultFilters: () => () => false,
    fetchDefaultFilters: vi.fn(async () => []),
    setListEntityName: vi.fn(),
    setListPath: vi.fn(),
    setListFilter: vi.fn(),
    setListFilters: vi.fn(),
    appliedListFilters: [],
  }),
}))

const gameRow = {
  id: 'g1',
  name: 'Book of Dead',
  slug: 'book-of-dead',
  isActive: true,
  runner: 'html5',
  producer: 'Play’n GO',
  type: 'slot',
  categories: [],
  tags: [],
  wageringBonusRatio: 50,
  decreaseRatio: 1,
  isGameOnBonuses: true,
  isAvailableWithBonuses: false,
  imagePath: 'img.png',
  createdAt: '2024-01-02T12:00:00Z',
  updatedAt: '2024-01-03T12:00:00Z',
}

const config = new BaseListConfig({
  withSearch: true,
  withExport: true,
  withDeactivation: true,
  selectable: true,
  selectMode: SelectMode.Page,
  filterList: [
    { type: FilterType.Status, key: 'isActive' },
    { type: FilterType.DateRangeUpdate, key: 'updated' },
  ],
})

const mountGames = async () => {
  const wrapper = getMountComponent({ useList: useGamesList, config }, global)

  await flushPromises()

  return wrapper
}

describe('Games list (integration: real useList + config)', () => {
  beforeEach(() => {
    mockCustomStore.fetchEntityList.mockReset()
    mockCustomStore.fetchEntityList.mockResolvedValue({ list: [gameRow], total: 1 })
  })

  it('requests the list once on mount via the section store', async () => {
    await mountGames()

    expect(mockCustomStore.fetchEntityList).toHaveBeenCalledTimes(1)
  })

  it('renders table with all columns from useList.fields', async () => {
    const wrapper = await mountGames()
    const keys = useGamesList().fields.map(f => f.key)

    for (const key of keys)
      expect(wrapper.find(`td[data-c-field="${key}"]`).exists(), `column ${key}`).toBe(true)
  })

  it('renders one row with the game data', async () => {
    const wrapper = await mountGames()

    expect(wrapper.findAll('tr[data-test-id="table-row"]')).toHaveLength(1)
    expect(wrapper.find('td[data-c-field="slug"]').text()).toContain('book-of-dead')
    expect(wrapper.find('td[data-c-field="runner"]').text()).toContain('html5')
  })

  it('renders no rows for an empty response', async () => {
    mockCustomStore.fetchEntityList.mockResolvedValue({ list: [], total: 0 })

    const wrapper = await mountGames()

    expect(wrapper.findAll('tr[data-test-id="table-row"]')).toHaveLength(0)
  })
})
