import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'

import SideBar from '../../../../src/components/templates/SideBar/index.vue'
import { getSelectorTestId, setMountComponent } from '../../utils'
import { ViewInfo, ViewType } from '../../../../src/@model/view'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { i18n } from '../../../../src/plugins/i18n'

vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    useRoute: vi.fn(() => ({
      params: {},
      name: 'TestRoute',
      query: { page: '1' },
    })),
  }
})

export class SideBarModel {
  readonly id: ViewInfo
  readonly name: ViewInfo

  constructor(data?: { id: string; name: string }) {
    this.id = new ViewInfo({
      type: ViewType.BadgeCopy,
      value: data?.id,
      label: 'ID',
    })
    this.name = new ViewInfo({
      type: ViewType.Text,
      value: data?.name,
      label: 'Name',
    })
  }
}

const getMountSideBar = setMountComponent(SideBar)

const item = { id: '123', name: 'Test name' }

const defaultProps = {
  item: {},
  entityName: 'Test',
  sidebarActive: true,
  sideBarModel: SideBarModel,
}

let props

describe('SideBar', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
  })

  it('Should render base elements of view generator on update item prop ', async () => {
    const global = {
      stubs: {
        VNavigationDrawer: { template: '<div> <slot /> </div>' },
      },
    }

    const wrapper = getMountSideBar(props, global)

    await wrapper.setProps({ item })

    await wrapper.vm.$nextTick()

    /// Check if the sidebar content is visible and render all elements
    Object.keys(item).forEach(key => {
      const viewGeneratorRowWrapper = wrapper.find(getSelectorTestId(`view-generator-row-${key}`))

      testOn.equalTextValue({ wrapper: viewGeneratorRowWrapper, testId: 'view-generator-component' }, item[key])
    })
  })

  it('Should render correct localized title of sidebar', async () => {
    const global = {
      stubs: {
        VNavigationDrawer: { template: '<div> <slot /> </div>' },
      },
    }

    const wrapper = getMountSideBar(props, global)

    testOn.equalTextValue({ wrapper, testId: 'sidebar-title' }, i18n.t('title.test.sidebarTitle'))
  })

  /// sidebar-actions

  it('Should render correct content by slot "sidebar-row"', async () => {
    const global = {
      stubs: {
        VNavigationDrawer: { template: '<div> <slot /> </div>' },
      },
    }

    /// Init slots by item data for more comfortable testing
    const slots = Object.keys(item).reduce((acc, key) => ({
      ...acc,
      [`sidebar-row(${key})`]: `<div data-test-id="sidebar-row-slot">Test sidebar row ${key}</div>`,
    }), {})

    const wrapper = getMountSideBar(props, global, slots)

    await wrapper.setProps({ item })

    await wrapper.vm.$nextTick()

    const slotWRappers = wrapper.findAll(getSelectorTestId('sidebar-row-slot'))

    /// Test if all slots are rendered and have correct content
    slotWRappers.forEach((slotWrapper, index) => {
      testOn.equalTextValue({ wrapper: slotWrapper }, `Test sidebar row ${Object.keys(item)[index]}`)
    })

    /// Check that not rendered excess content on sidebar
    testOn.notExistElement({ wrapper, testId: 'view-generator-component' })
  })

  it('Should render correct content by slot "sidebar-value"', async () => {
    const global = {
      stubs: {
        VNavigationDrawer: { template: '<div> <slot /> </div>' },
      },
    }

    /// Init slots by item data for more comfortable testing
    const slots = Object.keys(item).reduce((acc, key) => ({
      ...acc,
      [`sidebar-value(${key})`]: `<div data-test-id="sidebar-value">Test sidebar value ${key}</div>`,
    }), {})

    const wrapper = getMountSideBar(props, global, slots)

    await wrapper.setProps({ item })

    await wrapper.vm.$nextTick()

    const slotWRappers = wrapper.findAll(getSelectorTestId('sidebar-value'))

    /// Check that all slots are rendered
    testOn.checkLengthElements({ wrapper: slotWRappers, all: true }, Object.keys(item).length)

    /// Test if all slots are rendered and have correct content
    slotWRappers.forEach((slotWrapper, index) => {
      testOn.equalTextValue({ wrapper: slotWrapper }, `Test sidebar value ${Object.keys(item)[index]}`)
    })

    /// Check that not rendered excess content on sidebar
    testOn.notExistElement({ wrapper, testId: 'view-generator-component' })
  })

  it('Should render correct content by slot "sidebar-actions"', async () => {
    const global = {
      stubs: {
        VNavigationDrawer: { template: '<div> <slot /> </div>' },
      },
    }

    const slots = {
      'sidebar-actions': '<div data-test-id="sidebar-actions">Test sidebar actions</div>',
    }

    const wrapper = getMountSideBar(props, global, slots)

    await wrapper.setProps({ item })

    await wrapper.vm.$nextTick()

    testOn.equalTextValue({ wrapper, testId: 'sidebar-actions' }, 'Test sidebar actions')
  })
})
