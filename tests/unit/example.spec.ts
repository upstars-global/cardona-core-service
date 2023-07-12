import { createLocalVue, mount } from '@vue/test-utils'
import BaseSection from '../../src/components/templates/BaseSection/index.vue'
import { PageType } from '../../src/components/templates/BaseSection/model'
import { useDemoSection } from '../../src/pages/demo/useDemo'
import VueRouter from 'vue-router'

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
const router = new VueRouter()

describe('BaseList.vue', () => {
  it('BaseList', () => {
    const msg = 'new message'
    const wrapper = mount(BaseSection, {
      propsData: {
        pageType: PageType.Create,
        useEntity: useDemoSection,
      },
      mocks: {
        convertLowerCaseFirstSymbol: jest.fn(),
      },
      router,
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
