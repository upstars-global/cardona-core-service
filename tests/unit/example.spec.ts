import { mount } from '@vue/test-utils'
import BaseList from '../../src/components/templates/BaseList/index.vue'
import { BaseListConfig, UseListType } from '../../src/components/templates/BaseList/model'

jest.mock('../../src/@core/utils/utils', () => ({
  useRouter: jest.fn(() => {
    return {
      router: {
        resolve: () => true,
      },
      route: {
        value: {
          name: 'name',
        },
        matched: { isNotEmpty: true },
      },
    }
  }),
}))
jest.mock('../../src/helpers', () => ({
  checkExistsPage: jest.fn(() => {
    return true
  }),
}))

jest.mock('../../src/helpers', () => ({
  convertLowerCaseFirstSymbol: jest.fn(() => {
    return true
  }),
  checkExistsPage: jest.fn(() => {
    return true
  }),
  convertCamelCase: jest.fn(() => {
    return true
  }),
  getPermissionKeys: jest.fn(() => {
    return true
  }),
}))
jest.mock('../../src/use/pagination', () => ({
  usePagination: jest.fn(() => {
    return true
  }),
}))

const entityName = 'Demo'
const config: BaseListConfig = new BaseListConfig({
  withSettings: true,
  skeletonColumns: 10,
  responsive: true,
  withCustomFetchList: true,
  withSearch: true,
  createFromCopy: true,
  withExport: true,
  sidebar: true,
  sidebarCollapseMode: true,
  filterList: [],
})
const useList = (): UseListType => {
  const ListFilterModel = () => {}
  const SideBarModel = () => {}

  const fields = []

  return {
    entityName,
    fields,
    ListFilterModel,
    SideBarModel,
  }
}
describe('BaseList.vue', () => {
  it('BaseList', () => {
    const msg = 'new message'
    const wrapper = mount(BaseList, {
      propsData: {
        config,
        useList,
      },
      mocks: {
        convertLowerCaseFirstSymbol: jest.fn(),
      },
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
