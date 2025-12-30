import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'

import SideBar from '../../../../src/components/templates/SideBar/index.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../utils'
import { ViewInfo, ViewType } from '../../../../src/@model/view'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { i18n } from '../../../../src/plugins/i18n'
import { EMIT_AFTER_ANIMATION_SIDEBAR } from '../../../../src/utils/constants'
import { SideBarCollapseItem } from '../../../../src/@model/templates/baseList'

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

class SideBarModel {
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

class SideBarModelWithCollapseItem {
  collapseItem: SideBarCollapseItem
  constructor(data: { id: string; name: string }) {
    this.collapseItem = new SideBarCollapseItem({
      title: 'Collapse item test title',
      withBottomSeparator: true,
      views: {
        id: new ViewInfo({
          type: ViewType.BadgeCopy,
          value: data?.id,
          label: 'ID',
        }),
        name: new ViewInfo({
          type: ViewType.Text,
          value: data?.name,
          label: 'Name',
        }),
      },
    })
  }
}

const getMountSideBar = (props?: Record<string, unknown>, global = {}, slots?: Record<string, unknown>) => setMountComponent(SideBar)(props, {
  ...global,
  stubs: {
    VNavigationDrawer: { template: '<div> <slot /> </div>' },
  },
}, slots)

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
    const wrapper = getMountSideBar(props)

    await wrapper.setProps({ item })

    await wrapper.vm.$nextTick()

    /// Check if the sidebar content is visible and render all elements
    Object.keys(item).forEach(key => {
      const viewGeneratorRowWrapper = wrapper.find(getSelectorTestId(`view-generator-row-${key}`))

      testOn.equalTextValue({ wrapper: viewGeneratorRowWrapper, testId: 'view-generator-component' }, item[key])
    })
  })

  it('Should render correct localized title of sidebar', async () => {
    const wrapper = getMountSideBar(props)

    testOn.equalTextValue({ wrapper, testId: 'sidebar-title' }, i18n.t('title.test.sidebarTitle'))
  })

  /// sidebar-actions

  it('Should render correct content by slot "sidebar-row"', async () => {
    /// Init slots by item data for more comfortable testing
    const slots = Object.keys(item).reduce((acc, key) => ({
      ...acc,
      [`sidebar-row(${key})`]: `<div data-test-id="sidebar-row-slot">Test sidebar row ${key}</div>`,
    }), {})

    const wrapper = getMountSideBar(props, {}, slots)

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
    /// Init slots by item data for more comfortable testing
    const slots = Object.keys(item).reduce((acc, key) => ({
      ...acc,
      [`sidebar-value(${key})`]: `<div data-test-id="sidebar-value">Test sidebar value ${key}</div>`,
    }), {})

    const wrapper = getMountSideBar(props, {}, slots)

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
    const slots = {
      'sidebar-actions': '<div data-test-id="sidebar-actions">Test sidebar actions</div>',
    }

    const wrapper = getMountSideBar(props, {}, slots)

    await wrapper.setProps({ item })

    await wrapper.vm.$nextTick()

    testOn.equalTextValue({ wrapper, testId: 'sidebar-actions' }, 'Test sidebar actions')
  })

  it('Should render correct content by slot "sidebar-action-items"', async () => {
    props.canUpdate = true

    const slotValue = 'Test sidebar action items'

    const slots = {
      'sidebar-action-items': `<div data-test-id="sidebar-action-items">${slotValue}</div>`,
    }

    const wrapper = getMountSideBar(props, {}, slots)

    await wrapper.setProps({ item })

    await wrapper.vm.$nextTick()

    testOn.equalTextValue({ wrapper, testId: 'sidebar-action-items' }, slotValue)
  })

  it('Should render sidebar actions buttons by props', async () => {
    props.canUpdate = true

    const wrapper = getMountSideBar(props)

    await wrapper.setProps({ item })

    await wrapper.vm.$nextTick()

    testOn.existElement({ wrapper, selector: '.sidebar-actions' })

    /// Check that buttons are not rendered
    testOn.notExistElement({ wrapper, testId: 'edit-button' })
    testOn.notExistElement({ wrapper, testId: 'remove-button' })

    /// Set props for render buttons edit
    await wrapper.setProps({ canUpdateItem: true })

    /// Check that button is rendered
    testOn.existElement({ wrapper, testId: 'edit-button' })

    /// Set props for render buttons remove
    await wrapper.setProps({ canRemoveItem: true })

    /// Check that button is rendered
    testOn.existElement({ wrapper, testId: 'remove-button' })
  })
  it('Should on click remove call event "remove" and on edit call event "update"', async () => {
    vi.useFakeTimers()
    props = {
      ...props,
      canUpdate: true,
      canUpdateItem: true,
      canRemoveItem: true,
    }

    const wrapper = getMountSideBar(props)

    await wrapper.setProps({ item })

    await wrapper.vm.$nextTick()

    /// Simulate click on button
    await clickTrigger({ wrapper, testId: 'edit-button' })

    /// Make sure that the event is called after the animation
    vi.advanceTimersByTime(EMIT_AFTER_ANIMATION_SIDEBAR)

    testOn.isCalledEmitEvent({ wrapper }, 'update')

    /// Simulate click on button
    await clickTrigger({ wrapper, testId: 'remove-button' })

    /// Make sure that the event is called after the animation
    vi.advanceTimersByTime(EMIT_AFTER_ANIMATION_SIDEBAR)

    testOn.isCalledEmitEvent({ wrapper }, 'remove')

    /// Reset time travel
    vi.useRealTimers()
  })
  it('Should call events "update:sidebar-active" and "hide" on call method => onHide', async () => {
    props = {
      ...props,
      canUpdate: true,
      canUpdateItem: true,
      canRemoveItem: true,
    }

    const wrapper = getMountSideBar(props)

    await wrapper.setProps({ item })

    await wrapper.vm.$nextTick()

    /// Call method from component
    await wrapper.vm.onHide()

    /// Check call event with correct value
    testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'update:sidebar-active', value: false })
    testOn.isCalledEmitEvent({ wrapper }, 'hide')
  })

  it('Should withCollapseItem', async () => {
    props.sidebarCollapseMode = true

    /// Init props with model with collapse item
    props.sideBarModel = SideBarModelWithCollapseItem

    const wrapper = getMountSideBar(props)

    await wrapper.setProps({ item })

    await wrapper.vm.$nextTick()

    /// Create wrapper item with collapse item
    const collapseItemWrapper = wrapper.find(getSelectorTestId('collapse-item'))

    /// Check that is correct render title collapse item
    testOn.equalTextValue({ wrapper: collapseItemWrapper, selector: '.v-expansion-panel-title' }, 'Collapse item test title')

    /// Check that is correct render body collapse
    testOn.equalTextValue({ wrapper: collapseItemWrapper, testId: 'collapse-item-id' }, 'ID 123')
    testOn.equalTextValue({ wrapper: collapseItemWrapper, testId: 'collapse-item-name' }, 'NameTest name')

    /// Check that is correct render separator
    testOn.existElement({ wrapper, testId: 'collapse-item-separator' })
  })
})
