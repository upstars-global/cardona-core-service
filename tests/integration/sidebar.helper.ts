import { flushPromises } from '@vue/test-utils'
import { unref } from 'vue'
import { expect } from 'vitest'
import type { BaseListConfig, UseListType } from '../../src/@model/templates/baseList'
import { SideBarCollapseItem } from '../../src/@model/templates/baseList'
import { ViewInfo } from '../../src/@model/view'
import { getMountComponent, global, mockCustomStore } from '../unit/mocks/base-list/utils'

interface SidebarCheckOptions {
  useList: () => UseListType<object, object, object>
  config: BaseListConfig | Record<string, unknown>

  /** Raw row as the backend returns it (before ListItemModel). */
  row: Record<string, unknown>
}

/** All ViewInfo keys the SideBarModel produces, including those nested in SideBarCollapseItem. */
const collectViewKeys = (model: Record<string, unknown>): string[] =>
  Object.entries(model).flatMap(([key, value]) => {
    if (value instanceof ViewInfo)
      return [key]
    if (value instanceof SideBarCollapseItem)
      return Object.keys(value.views)

    return []
  })

/**
 * Checks that the list config + useList really give a working sidebar:
 * `config.sidebar` is on, `useList.SideBarModel` exists, a row click opens the drawer,
 * and every ViewInfo from `new SideBarModel(item)` is rendered with its label.
 *
 * Needs `collapse` panels rendered eagerly — SideBar does it under IS_TEST_ENV.
 */
export const expectSidebarWorks = async ({ useList, config, row }: SidebarCheckOptions) => {
  const list = useList()

  expect((config as BaseListConfig).sidebar, 'config.sidebar must be true').toBe(true)
  expect(list.SideBarModel, 'useList must return SideBarModel').toBeTypeOf('function')

  mockCustomStore.fetchEntityList.mockResolvedValue({ list: [row], total: 1 })

  // VNavigationDrawer needs a Vuetify layout; the stub keeps SideBar's own `v-if="sidebarActive"` logic
  const wrapper = getMountComponent({ useList, config }, {
    ...global,
    stubs: { VNavigationDrawer: { template: '<div><slot name="prepend" /><slot /></div>' } },
  })

  await flushPromises()

  expect(unref(wrapper.vm.isSidebarShown), 'sidebar closed before click').toBe(false)

  await wrapper.find('tr[data-test-id="table-row"]').trigger('click')
  await flushPromises()

  expect(unref(wrapper.vm.isSidebarShown), 'row click must open sidebar').toBe(true)

  // The model is built from the item the list actually holds (after ListItemModel)
  const item = unref(wrapper.vm.items)[0]
  const expected = new list.SideBarModel!(item) as Record<string, unknown>
  const keys = collectViewKeys(expected)

  expect(keys.length, 'SideBarModel produced no ViewInfo').toBeGreaterThan(0)

  const html = wrapper.html()

  for (const key of keys)
    expect(html, `sidebar row ${key}`).toContain(`data-test-id="view-generator-row-${key}"`)

  return { wrapper, keys, expected }
}
