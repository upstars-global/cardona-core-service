import { beforeEach, describe, it, vi } from 'vitest'

import FiltersBlock from '../../../../src/components/FiltersBlock/index.vue'
import { clickTrigger, setMountComponent } from '../../utils'
import { VSizes } from '../../../../src/@model/vuetify'
import { TextBaseField } from '../../../../src/@model/templates/baseField'
import { testOn } from '../../templates/shared-tests/test-case-generator'

vi.mock('vuex', async importOriginal => {
  const actual = await importOriginal()

  const mockStore = {
    state: {},
    getters: {
      'filtersCore/listPath': '/mocked-path',
      'filtersCore/listEntityName': 'mocked-entity',
      'filtersCore/appliedListFilters': [],
      'abilityCan': () => vi.fn(() => true),
      'appConfigCore/allCurrencies': ['USD', 'EUR', 'CAD'],
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

const getMountFiltersBlock = setMountComponent(FiltersBlock)

vi.mock('lodash', async importOriginal => {
  const actual = await importOriginal()

  return {
    debounce: (fn: Function) => fn,
    has: actual.has,
    cloneDeep: val => val,
  }
})

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

  it('Should render component with empty filters and opened', async () => {
    props.isOpen = true

    const wrapper = getMountFiltersBlock(props)

    testOn.existClass({ wrapper, testId: 'main-wrapper' }, 'mb-6')
    testOn.notExistElement({ wrapper, selector: '.filters-block-small' })
    testOn.notExistClasses({ wrapper, testId: 'filter-title' }, 'py-4')
    testOn.notExistElement({ wrapper, testId: 'filter-row' })
  })

  it('Should select item of filter and render current field input ', async () => {
    props.filters = filters
    props.isOpen = true

    const wrapper = getMountFiltersBlock(props)

    await clickTrigger({ wrapper, testId: 'btn-filter-select' })

    await clickTrigger({ wrapper, testId: 'filter-item' })
  })
})
