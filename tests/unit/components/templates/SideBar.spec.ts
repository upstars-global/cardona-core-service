import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'

import SideBar from '../../../../src/components/templates/SideBar/index.vue'
import { setMountComponent } from '../../utils'
import { ViewInfo, ViewType } from '../../../../src/@model/view'

vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      getRoutes: vi.fn(() => [
        { name: 'TestCreate', path: '/test/create' },
        { name: 'TestRoute', path: '/test-route' },
      ]),
    })),
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

const defaultProps = {
  item: { id: '123', name: 'Test name' },
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

    console.log(wrapper.html(), '!!!')
  })
})
