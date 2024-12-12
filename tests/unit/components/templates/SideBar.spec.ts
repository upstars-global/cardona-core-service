import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'

import SideBar from '../../../../src/components/templates/SideBar/index.vue'
import { getSelectorTestId, setMountComponent } from '../../utils'
import { ViewInfo, ViewType } from '../../../../src/@model/view'
import { testOn } from '../../templates/shared-tests/test-case-generator'

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

  it('Should render correct default state', async () => {
    props.draggable = true

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
})
