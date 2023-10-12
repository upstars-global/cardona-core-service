import { createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'

/*jest.mock('../../src/@core/utils/utils', () => ({
  useRouter: jest.fn(() => {
    return {
      router: {
        resolve: () => true,
      },
      route: {
        value: {
          name: 'name',
          params: {
            id: 'test',
          },
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
}))*/

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(BootstrapVue)
/*const router = new VueRouter()
const listConfig = new BaseListConfig({
  withSettings: true,
  skeletonColumns: 10,
  responsive: true,
  withCustomFetchList: true,
  withSearch: true,
  createFromCopy: true,
  withExport: true,
  sidebar: true,
  sidebarCollapseMode: true,
  filterList: [
    {
      type: FilterType.Status,
      key: 'isActive',
    },
    {
      type: FilterType.DateRangeCreative,
      key: 'created',
    },
    {
      type: ProjectFilterTypes.Tags,
      key: 'tagsIds',
      trackBy: 'id',
    },
    {
      type: FilterType.TransactionsType,
      key: 'type',
      trackBy: 'id',
    },
    {
      type: FilterType.GameId,
      key: 'gameId',
    },
  ],
})*/

describe('test ', () => {
  it('test', () => {
    /*const message = 'No Actions'
      const wrapper = mount(BaseSection, {
        propsData: {
          pageType: PageType.Create,
          useEntity: useDemoSection,
        },
        slots: {
          actions: `<div>${message}</div>`,
        },
        router,
        localVue,
      })
      expect(wrapper.text()).toMatch(message)
    })
    /!*it('DateField', () => {
      const msg = 'new message'
      const wrapper = mount(DateField, {
        propsData: {
          date: new Date(),
        },
        mocks: {
          convertLowerCaseFirstSymbol: jest.fn(),
        },
        router,
      })
      expect(wrapper.text()).toMatch(msg)
    })*!/

    /!*it('BaseList', () => {
      const msg = 'new message'
      const wrapper = shallowMount(BaseList, {
        propsData: {
          useList: useDemoList,
          config: listConfig,
        },
        mocks: {
          convertLowerCaseFirstSymbol: jest.fn(),
        },
        localVue,
        router,
      })
      expect(wrapper.text()).toMatch(msg)*/
  })
})