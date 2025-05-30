import { beforeEach, describe, it, vi } from 'vitest'

import FiltersBlock from '../../../../src/components/FiltersBlock/index.vue'
import { clickTrigger, setMountComponent } from '../../utils'
import { VSizes } from '../../../../src/@model/vuetify'
import { TextBaseField } from '../../../../src/@model/templates/baseField'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { i18n } from '../../../../src/plugins/i18n'

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
        { type: 'TestPage_mocked-entity', fields: ['name'] },
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

const testIds = {
  filterRow: 'filter-row',
  filterTitle: 'filter-title',
  applyBtn: 'apply-btn',
}

const openFilters = async wrapper => {
  await clickTrigger({ wrapper, testId: 'btn-filter-select' })

  await clickTrigger({ wrapper, testId: 'filter-item' })
}

describe('FiltersBlock', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Should render component with empty filters and opened', async () => {
    props.isOpen = true

    const wrapper = getMountFiltersBlock(props)

    testOn.existClass({ wrapper, testId: 'main-wrapper' }, 'mb-6')
    testOn.notExistElement({ wrapper, selector: '.filters-block-small' })
    testOn.notExistElement({ wrapper, testId: testIds.filterRow })
  })

  it('Should select item of filter and render current field input ', async () => {
    props.filters = filters
    props.isOpen = true

    const wrapper = getMountFiltersBlock(props)

    await openFilters(wrapper)

    testOn.existElement({ wrapper, testId: testIds.filterRow })
  })

  it('Should render selected filter items in badges when filter hidden', async () => {
    props.filters = filters
    props.isOpen = true

    const wrapper = getMountFiltersBlock(props)

    await openFilters(wrapper)

    testOn.existElement({ wrapper, testId: testIds.filterRow })

    /// Hide filter
    await wrapper.setProps({ isOpen: false })

    /// Check applied filters exist
    testOn.existElement({ wrapper, testId: 'applied-filters-wrapper' })

    /// Check applied filters items
    testOn.checkLengthElements(
      { wrapper, testId: 'applied-filters-item', all: true },
      props.filters.length,
    )
  })

  it('Should render correct content with size small', async () => {
    props = {
      filters,
      isOpen: true,
      size: VSizes.Small,
      entityName: 'Test',
    }

    const wrapper = getMountFiltersBlock(props)

    await openFilters(wrapper)

    testOn.existElement({ wrapper, selector: '.filters-block-small' })

    testOn.existClass({ wrapper, testId: testIds.filterTitle }, 'py-4')

    testOn.existClass({ wrapper, selector: '.filter-label' }, 'font-small-3')

    testOn.equalTextValue({ wrapper, testId: testIds.applyBtn }, i18n.t('action.applyFilters'))
  })

  it('Should render render correct content with size which not equal small', async () => {
    props = {
      filters,
      isOpen: true,
      entityName: 'Test',
    }

    const wrapper = getMountFiltersBlock(props)

    await openFilters(wrapper)

    testOn.notExistElement({ wrapper, selector: '.filters-block-small' })

    testOn.notExistElement({ wrapper, selector: 'h5.text-h5' })

    testOn.notExistClasses({ wrapper, selector: '.filter-label' }, 'font-small-3')

    testOn.equalTextValue({ wrapper, testId: testIds.applyBtn }, i18n.t('action.applyFilters'))
  })

  it('Should remove input on click button remove ', async () => {
    props.filters = filters
    props.isOpen = true

    const wrapper = getMountFiltersBlock(props)

    await openFilters(wrapper)

    testOn.existElement({ wrapper, testId: testIds.filterRow })

    await clickTrigger({ wrapper, selector: '.v-btn--rectangle' })

    testOn.notExistElement({ wrapper, testId: testIds.filterRow })
  })

  it('Should call event apply filter', async () => {
    props.filters = filters
    props.isOpen = true

    const wrapper = getMountFiltersBlock(props)

    await openFilters(wrapper)

    testOn.existElement({ wrapper, testId: testIds.filterRow })

    await clickTrigger({ wrapper, testId: testIds.applyBtn })

    testOn.isCalledEmitEvent({ wrapper }, 'apply')
  })

  it('Call event change-selected-filters and should be equal with selected filters', async () => {
    props.filters = filters
    props.isOpen = true

    const wrapper = getMountFiltersBlock(props)

    await openFilters(wrapper)

    testOn.isCalledEmitEventValueToEqualDeep({ wrapper }, { event: 'change-selected-filters', value: [...filters] })
  })
})
