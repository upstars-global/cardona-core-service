import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { permissionsMock } from '../unit/mocks/base-list/static-mock'
import { BaseListConfig } from '../../src/@model/templates/baseList'
import { getMountComponent, global, mockCustomStore, updateEntity } from '../unit/mocks/base-list/utils'
import BaseListCell from '../../src/components/templates/BaseList/_components/BaseListCell.vue'
import type { RowCellDef } from '../unit/components/templates/BaseList/types/row-render.harness'
import { expectItemActions, expectRow, mountRow, openActionMenu } from '../unit/components/templates/BaseList/types/row-render.harness'
import { i18n } from '../../src/plugins/i18n'
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

const gameRow: Record<string, unknown> = {
  isActive: true,
  name: 'Book of Dead',
  slug: 'book-of-dead',
  runner: 'html5',
  producer: 'Play’n GO',
  type: 'slot',
  categories: [{ id: 'c1', name: 'Slots', slug: 'slots' }],
  decreaseRatio: 1,
  wageringBonusRatio: 50,
  isGameOnBonuses: true,
  isAvailableWithBonuses: false,
  tags: [{ name: 'hot' }],
  image: { imagePath: 'img.png', id: 'g1', compressionForPreview: 45 },
  createdAt: '2024-01-02T12:00:00Z',
  updatedAt: '2024-01-03T12:00:00Z',
}

/** Колонки беремо з реального useGamesList().fields, значення — з gameRow. */
const gameCells = (): RowCellDef[] => useGamesList().fields.map(f => ({
  key: f.key,
  type: f.type,
  value: gameRow[f.key],
  rawExtra: f.key === 'name' ? { name: gameRow.name } : undefined,
}))

// harness кладе рядок у base store, тому для row-тестів відв'язуємо кастомний useStore
const gameUseList = () => ({ ...useGamesList(), useStore: undefined })

const gameConfig = { withDeactivation: true, createFromCopy: true }

const mountGame = (opts: Parameters<typeof mountRow>[1] = {}) =>
  mountRow(gameCells(), { ...opts, useList: { ...gameUseList(), ...opts.useList }, config: { ...gameConfig, ...opts.config } })

describe('Games list rows (integration + row-render harness)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('every game column renders the component of its ListFieldType', async () => {
    expectRow(await mountGame())
  })

  it('column values: text, percent, statement, badges', async () => {
    const m = await mountGame()

    expect(m.cellEl('slug').text()).toContain('book-of-dead')
    expect(m.cellEl('wageringBonusRatio').text()).toContain('50')
    expect(m.cellEl('isGameOnBonuses').text()).toContain('Yes')
    expect(m.cellEl('isAvailableWithBonuses').text()).toContain('No')
    expect(m.cellEl('tags').find('[data-test-id="badge-0"]').exists()).toBe(true)
  })

  it('empty badges array renders no badge', async () => {
    const cells = gameCells().map(c => (c.key === 'tags' ? { ...c, value: [] } : c))
    const m = await mountRow(cells, { useList: gameUseList(), config: gameConfig })

    expect(m.cellEl('tags').find('[data-test-id="badge-0"]').exists()).toBe(false)
  })

  describe('actions menu with the games config', () => {
    it('renders ItemActions in the actions column', async () => {
      expectItemActions(await mountGame())
    })

    it('shows remove, status-toggle and copy for a full-access user', async () => {
      const menu = await openActionMenu(await mountGame())

      expect(menu.has('remove')).toBe(true)
      expect(menu.has('status-toggle')).toBe(true)
      expect(menu.has('copy')).toBe(true)
    })

    it('canRemove / canUpdate / canCreate hide the matching items', async () => {
      expect((await openActionMenu(await mountGame({ permissions: { canRemove: false } }))).has('remove')).toBe(false)
      expect((await openActionMenu(await mountGame({ permissions: { canUpdate: false } }))).has('status-toggle')).toBe(false)
      expect((await openActionMenu(await mountGame({ permissions: { canCreate: false } }))).has('copy')).toBe(false)
    })

    it('copyForAllProjects with 2+ projects renders a project submenu instead of the plain copy item', async () => {
      const m = await mountGame({ config: { copyForAllProjects: true } })
      const menu = await openActionMenu(m)

      expect(menu.has('copy')).toBe(false)
      expect(m.cellEl('actions').text()).toContain(i18n.t('action.makeCopy'))
    })

    it('withDeactivation: false removes status-toggle', async () => {
      const menu = await openActionMenu(await mountGame({ config: { withDeactivation: false } }))

      expect(menu.has('status-toggle')).toBe(false)
    })

    it('toggle status sends the inverted isActive', async () => {
      const m = await mountGame()

      m.wrapper.findComponent(BaseListCell).vm.$emit('on-toggle-status', { id: m.row.id, isActive: true })
      await flushPromises()
      expect(updateEntity).toHaveBeenCalledWith(expect.objectContaining({ data: { form: { id: m.row.id, isActive: false } } }))
    })
  })
})

describe('Games list page-level config', () => {
  const mount = async (config: Partial<ConstructorParameters<typeof BaseListConfig>[0]> = {}) => {
    mockCustomStore.fetchEntityList.mockResolvedValue({ list: [], total: 0 })
    Object.assign(permissionsMock, { canExport: true })

    const wrapper = getMountComponent({
      useList: useGamesList,
      config: new BaseListConfig({ filterList: [], emptyText: 'No games yet', ...config }),
    }, global)

    await flushPromises()

    return wrapper
  }

  it('withSearch toggles the search input', async () => {
    expect((await mount({ withSearch: true })).find('[data-test-id="search-input"]').exists()).toBe(true)
    expect((await mount({ withSearch: false })).find('[data-test-id="search-input"]').exists()).toBe(false)
  })

  it('withExport toggles the export selector', async () => {
    expect((await mount({ withExport: true })).find('[data-test-id="export-format-selector"]').exists()).toBe(true)
    expect((await mount({ withExport: false })).find('[data-test-id="export-format-selector"]').exists()).toBe(false)
  })

  it('empty response shows config.emptyText', async () => {
    expect((await mount()).text()).toContain('No games yet')
  })
})
