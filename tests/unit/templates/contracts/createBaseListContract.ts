import { unref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import type { BaseListConfig, UseListType } from '../../../../src/@model/templates/baseList'
import { setMountComponent, withSetup } from '../../utils'
import DefaultBaseList from '../../../../src/components/templates/BaseList/types/default.vue'
import { testOn } from '../shared-tests/test-case-generator'
import { mockModal } from '../../mocks/modal-provide-config'
import { mockBaseStoreCore } from '../../mocks/base-list/utils'
import { looksLikeI18nKey } from './i18nChecks'

type ActionMock = ReturnType<typeof vi.fn>

export interface FetchActionConfig {
  expect: 'fetchEntityList'

  /** Assert the standard `{ type, data: { perPage, page, filter, sort } }` payload shape. */
  assertPayload?: boolean
}

export interface DeleteActionConfig {
  expect: 'deleteEntity'
  refetchesAfter?: boolean
}

export interface ToggleStatusActionConfig {

  /**
   * Always baseStoreCore, regardless of a custom useStore — see BaseList/types/default.vue
   * onClickToggleStatus. Which action depends on the section's own listConfig:
   * `withDeactivationBySpecificAction: true` routes through `toggleStatusEntity` instead of the
   * default `updateEntity` (confirmed in default.vue — the two are not interchangeable, and
   * which one a section uses is a property of its BaseListConfig, not of this generator).
   */
  expect: 'baseStoreCore.updateEntity' | 'baseStoreCore.toggleStatusEntity'
}

export interface MultiDeleteActionConfig {
  expect: 'multipleDeleteEntity'
}

export interface BaseListContractActions {

  /**
   * 'custom' for a fully custom fetchEntityList (e.g. payouts: fans out Promise.all per project,
   * filters/sorts client-side) — the contract then only asserts the list renders, not a payload shape.
   */
  fetch: FetchActionConfig | 'custom'
  delete?: DeleteActionConfig
  toggleStatus?: ToggleStatusActionConfig
  multiDelete?: MultiDeleteActionConfig
}

export interface BaseListContractConfig {

  /** The real production composable — entityName/fields/ListItemModel/useStore are derived from it, never redeclared. */
  useList: () => UseListType

  /** One sample RAW backend list item (as the API returns it) used to drive rendering across all checks. */
  sampleBackendResponse: Record<string, unknown>

  /**
   * Hand-written ground truth for what a few key fields must render as, independent of
   * ListItemModel's own computation. Required to catch a real model regression: since
   * fetchEntityList is mocked, nothing in this contract runs ListItemModel for real unless this
   * is provided — comparing a rendered cell against a value computed by the same (possibly
   * broken) model is tautological and can never fail. Not every field needs an entry; fields
   * without one fall back to an existence-only check (documented limitation, not a regression
   * guard on content).
   */
  expectedFieldValues?: Record<string, string>
  actions: BaseListContractActions

  /**
   * Guards against entityName drift (typo/copy-paste from another section) — the request `type`
   * sent to ApiService must match this literal, not just whatever useList() happens to return.
   */
  expectedEntityName?: string

  /**
   * Required only when useList() wires a custom store (useStore). Vitest's module mocks are
   * static/hoisted per spec file, so this generator cannot vi.mock an arbitrary custom store
   * module itself — the calling spec file must do that (vi.mock('@/stores/x', ...)) and pass the
   * resulting mock object here so the contract has something to assert against.
   */
  customStoreMock?: Record<string, ActionMock>

  /**
   * The section's own BaseListConfig overrides (e.g. withDeactivationBySpecificAction,
   * withExport, withSettings). useList() carries no config — it's set independently by the
   * page (see e.g. src/pages/demo/list/index.vue) — so without this the contract always mounts
   * with a minimal generic config, silently missing any config-flag-dependent behavior.
   */
  listConfig?: ConstructorParameters<typeof BaseListConfig>[0]
}

const getFieldKey = (field: { key: string }) => field.key

export function createBaseListContract(config: BaseListContractConfig) {
  const mountComponent = setMountComponent(DefaultBaseList)

  const { entityName, fields: rawFields, useStore, ListItemModel } = withSetup(config.useList)
  const fields = unref(rawFields) as Array<{ key: string }>

  // Mirrors what baseStoreCore.fetchEntityList does in production (maps raw API items through
  // ListItemModel via `options.listItemModel`) — without this, the mock would just echo raw
  // sampleBackendResponse straight to the DOM and no model code would ever run in the test.
  const renderedItem = ListItemModel ? new ListItemModel(config.sampleBackendResponse) : config.sampleBackendResponse

  if (useStore && !config.customStoreMock) {
    throw new Error(
      '[createBaseListContract] useList() wires a custom store (useStore) — pass `customStoreMock` '
      + 'matching the real store shape, and vi.mock the real store module in the spec file before '
      + 'calling this contract.',
    )
  }

  const props = {
    useList: config.useList,
    config: {
      filterList: [],
      loadingEndpointArr: [],
      loadingOnlyByList: false,
      ...config.listConfig,
    },
  }

  const global = {
    provide: { modal: mockModal },
    components: {
      VueSelect: { template: '<select><slot /></select>' },
    },
  }

  const mockListResponse = (overrides?: { list?: unknown[]; total?: number }) =>
    mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({
      list: [renderedItem],
      total: 1,
      ...overrides,
    })

  describe(`[contract] BaseList: ${entityName}`, () => {
    beforeEach(() => {
      mockBaseStoreCore.fetchEntityList.mockReset()
      mockBaseStoreCore.deleteEntity.mockReset()
      mockBaseStoreCore.updateEntity.mockReset()
      mockBaseStoreCore.toggleStatusEntity.mockReset()
      mockBaseStoreCore.multipleDeleteEntity.mockReset()
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    if (config.expectedEntityName) {
      it(`entityName matches the expected API type ("${config.expectedEntityName}")`, () => {
        expect(entityName).toBe(config.expectedEntityName)
      })
    }

    describe('store state', () => {
      it('renders list rows when fetchEntityList resolves with data', async () => {
        mockListResponse()

        const wrapper = mountComponent(props, global)

        await flushPromises()

        testOn.existElement({ wrapper, testId: 'default-base-list' })
        expect(wrapper.findAll('tbody tr').length).toBeGreaterThan(0)
      })

      it('renders no rows when fetchEntityList resolves empty', async () => {
        mockListResponse({ list: [], total: 0 })

        const wrapper = mountComponent(props, global)

        await flushPromises()

        expect(wrapper.findAll('tbody tr').length).toBe(0)
      })
    })

    describe('field rendering (structural integrity)', () => {
      it('has unique field keys', () => {
        const keys = fields.map(getFieldKey)

        expect(new Set(keys).size).toBe(keys.length)
      })

      it.each(fields.map(getFieldKey))('renders a cell for field "%s"', async key => {
        mockListResponse()

        const wrapper = mountComponent(props, global)

        await flushPromises()

        const cell = wrapper.find(`td[data-c-field="${key}"]`)

        expect(cell.exists()).toBe(true)

        // BaseList renders one <td> per configured field regardless of whether the item
        // actually has that property — an empty cell still "exists". A real regression guard
        // needs a ground-truth value that does NOT come from calling the (possibly broken)
        // model/field itself, which is exactly what expectedFieldValues is for.
        if (config.expectedFieldValues && key in config.expectedFieldValues)
          expect(cell.text()).toContain(config.expectedFieldValues[key])
      })
    })

    describe('i18n label completeness', () => {
      // useList() resolves field.title via i18n.t(key) eagerly (see useDemoList), so by the
      // time fields reach us the key is already gone — but vue-i18n's default missing-key
      // fallback returns the key string unchanged, so a title that still LOOKS like a dotted
      // i18n key (not real translated text) means the translation doesn't exist.
      it.each(fields.map(getFieldKey))('field "%s" title is not an unresolved i18n key', key => {
        const field = fields.find(f => f.key === key)!

        expect(looksLikeI18nKey((field as { title?: unknown }).title)).toBe(false)
      })
    })

    describe('user actions', () => {
      const fetchConfig = config.actions.fetch

      if (fetchConfig === 'custom') {
        it('fetches and renders the list via a custom fetch implementation', async () => {
          const wrapper = mountComponent(props, global)

          await flushPromises()

          testOn.existElement({ wrapper, testId: 'default-base-list' })
        })
      }
      else {
        it('calls fetchEntityList', async () => {
          mockListResponse({ list: [], total: 0 })
          mountComponent(props, global)

          await flushPromises()

          if (fetchConfig.assertPayload) {
            expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalledWith(
              expect.objectContaining({
                type: entityName,
                data: expect.objectContaining({ page: expect.any(Number), perPage: expect.any(Number) }),
              }),
            )
          }
          else {
            expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalled()
          }
        })
      }

      if (config.actions.delete) {
        const deleteConfig = config.actions.delete

        it('calls deleteEntity and refetches the list', async () => {
          mockBaseStoreCore.fetchEntityList.mockResolvedValue({ list: [renderedItem], total: 1 })

          const wrapper = mountComponent(props, global)

          await flushPromises()

          const callsBefore = mockBaseStoreCore.fetchEntityList.mock.calls.length

          wrapper.vm.selectedItem = { id: renderedItem.id }
          await wrapper.vm.onClickModalOk({ hide: vi.fn(), commentToRemove: '' })
          await flushPromises()

          expect(mockBaseStoreCore.deleteEntity).toHaveBeenCalledWith(
            expect.objectContaining({ type: entityName, id: renderedItem.id }),
          )

          if (deleteConfig.refetchesAfter)
            expect(mockBaseStoreCore.fetchEntityList.mock.calls.length).toBeGreaterThan(callsBefore)
        })
      }

      if (config.actions.toggleStatus) {
        const toggleStatusConfig = config.actions.toggleStatus

        const toggleStatusAction = toggleStatusConfig.expect === 'baseStoreCore.toggleStatusEntity'
          ? mockBaseStoreCore.toggleStatusEntity
          : mockBaseStoreCore.updateEntity

        it(`always calls ${toggleStatusConfig.expect}, even with a custom store`, async () => {
          mockBaseStoreCore.fetchEntityList.mockResolvedValue({ list: [renderedItem], total: 1 })

          const wrapper = mountComponent(props, global)

          await flushPromises()

          await wrapper.vm.onClickToggleStatus({ id: renderedItem.id, isActive: true })
          await flushPromises()

          expect(toggleStatusAction).toHaveBeenCalledWith(
            expect.objectContaining({ type: entityName }),
          )

          if (config.customStoreMock?.updateEntity)
            expect(config.customStoreMock.updateEntity).not.toHaveBeenCalled()
        })
      }

      if (config.actions.multiDelete) {
        it('calls multipleDeleteEntity when 2+ items are selected', async () => {
          mockBaseStoreCore.fetchEntityList.mockResolvedValue({ list: [renderedItem], total: 1 })

          const wrapper = mountComponent(props, global)

          await flushPromises()

          const items = [renderedItem, { ...renderedItem, id: `${renderedItem.id}-2` }]

          wrapper.vm.items = items
          wrapper.vm.onRowSelected(items)
          await wrapper.vm.$nextTick()

          await wrapper.vm.onClickDeleteMultiple()

          expect(mockBaseStoreCore.multipleDeleteEntity).toHaveBeenCalledWith(
            expect.objectContaining({ type: entityName, ids: items.map(item => item.id) }),
          )
        })
      }
    })
  })
}
