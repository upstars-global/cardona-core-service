import { beforeEach, describe, it, vi } from 'vitest'

import FiltersBlock from '../../../../src/components/FiltersBlock/index.vue'
import { setMountComponent } from '../../utils'
import { VSizes } from '../../../../src/@model/vuetify'
import { TextBaseField } from '../../../../src/@model/templates/baseField'

const getMountFiltersBlock = setMountComponent(FiltersBlock)

vi.mock('vuex', async importOriginal => {
  const actual = await importOriginal()

  const mockStore = {
    state: {},
    getters: {
      'filtersCore/listPath': '/mocked-path',
      'filtersCore/listEntityName': 'mocked-entity',
      'filtersCore/appliedListFilters': [],
    },
    actions: {
      'filtersCore/fetchDefaultFilters': vi.fn(async () => [
        { type: 'TestPage_mocked-entity', fields: ['key1', 'key2'] },
      ]),
      'filtersCore/setDefaultFilter': vi.fn(async () => {}),
    },
    mutations: {
      'filtersCore/SET_LIST_ENTITY_NAME': vi.fn(),
      'filtersCore/SET_LIST_PATH': vi.fn(),
      'filtersCore/SET_LIST_FILTERS': vi.fn(),
    },
    dispatch: vi.fn((action, payload) => {
      if (mockStore.actions[action])
        return mockStore.actions[action](payload)
    }),
    commit: vi.fn((mutation, payload) => {
      if (mockStore.mutations[mutation])
        mockStore.mutations[mutation](payload)
    }),
  }

  return {
    ...actual,
    createStore: () => ({
      state: mockStore.state,
      getters: mockStore.getters,
      actions: mockStore.actions,
      mutations: mockStore.mutations,
      dispatch: mockStore.dispatch,
      commit: mockStore.commit,
    }),
    useStore: () => mockStore,
  }
})

vi.mock('lodash', () => ({
  cloneDeep: vi.fn(value => value),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: 'TestPage',
    path: '/mocked-path',
    params: {},
    query: {},
  }),
}))

const filters = [
  new TextBaseField({
    key: 'name',
    label: 'Name',
    placeholder: 'Name',
    value: 'Some name',
  }),
]

const defaultProps = {
  entityName: 'Test',
  filters: [],
  isOpen: false,
  size: VSizes.Medium,
}

let props

describe('FiltersBlock', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Should render component with empty filters and size Md', async () => {
    props.filters = filters
    props.isOpen = true

    const wrapper = getMountFiltersBlock(props)

    console.log(wrapper.html())
  })
})
