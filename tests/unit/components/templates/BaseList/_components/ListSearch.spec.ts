import { beforeEach, describe, expect, it, vi } from 'vitest'
import ListSearch from '../../../../../../src/components/templates/BaseList/_components/ListSearch.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../../../utils'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'
import { IconsList } from '../../../../../../src/@model/enums/icons'
import { i18n } from '../../../../../../src/plugins/i18n'
import { ExportFormat } from '../../../../../../src/@model/templates/baseList'
import { FilterType } from '../../../../../../src/@model/filter'

const getMountListSearch = setMountComponent(ListSearch)

const filterList = [
  {
    type: FilterType.DemoType,
    key: 'demo',
  },
]

const defaultProps = {
  config: {
    withSearch: true,
    searchPlaceholder: 'Search...',
    filterList,
    formatOfExports: [ExportFormat.JSON],
    small: false,
  },
  modelValue: '',
  selectedFilters: [],
  exportSelector: {
    canShow: false,
    disable: false,
  },
  rightSearchBtn: {
    canCreate: false,
    createPage: '',
  },
  isOpenFilterBlock: false,
}

let props

beforeEach(() => {
  props = defaultProps
})

describe('ListSearch.vue', () => {
  it('Renders search input', async () => {
    const wrapper = getMountListSearch(props)

    const input = wrapper.find(getSelectorTestId('search-input'))

    testOn.existElement({ wrapper: input })
    testOn.isEqualPlaceholder({ wrapper: input }, props.config.placeholder)
    testOn.existClass({ wrapper: input, selector: '.v-field__prepend-inner i' }, IconsList.SearchIcon)

    /// Update props with disable search input
    await wrapper.setProps({ config: { withSearch: false } })

    /// Check on not rendering search input
    testOn.notExistElement({ wrapper, testId: 'search-input' })
  })

  it('Check on render content of slots', async () => {
    const global = {}

    const leftSearchSlotText = 'Left search btn'
    const rightSearchSlotText = 'Right search btn'

    const testCaseParamsForSlots = [
      {
        key: 'left',
        text: leftSearchSlotText,
      }, {
        key: 'right',
        text: rightSearchSlotText,
      },
    ]

    const slots = {
      'left-search-btn': `<div data-test-id="left-search-btn"> ${leftSearchSlotText} </div>`,
      'right-search-btn': `<div data-test-id="right-search-btn"> ${rightSearchSlotText} </div>`,
    }

    const wrapper = getMountListSearch(props, global, slots)

    testCaseParamsForSlots.forEach(param => {
      const testId = `${param.key}-search-btn`

      testOn.existElement({ wrapper, testId })
      testOn.existTextValue({ wrapper, testId }, param.text)
    })
  })

  it('Render and call action on default slot content right-search-btn ', async () => {
    props.rightSearchBtn = {
      canCreate: true,
      createPage: 'MockCreatePage',
    }

    const wrapper = getMountListSearch(props)

    testOn.existElement({ wrapper, testId: 'right-search-btn' })

    testOn.equalTextValue({ wrapper, testId: 'right-search-btn-text' }, i18n.t('action.create'))

    expect(wrapper.props().rightSearchBtn.createPage).toBe(props.rightSearchBtn.createPage)
  })

  it('Render export format selector ', async () => {
    props.exportSelector = { canShow: true }

    const wrapper = getMountListSearch(props)

    const wrapeprParams = { wrapper, testId: 'menu-activator' }

    testOn.existElement(wrapeprParams)

    await clickTrigger(wrapeprParams)

    testOn.isCalledEmitEvent({ wrapper }, 'on-export-format-selected')
  })

  it('Check functionality of button filter', async () => {
    props.selectedFilters = [{}, {}]

    const wrapper = getMountListSearch(props)

    testOn.equalTextValue({ wrapper, testId: 'filter-count' }, props.selectedFilters.length.toString())
    testOn.equalTextValue({ wrapper, testId: 'filter-btn-text' }, i18n.t('common.filter._'))

    await clickTrigger({ wrapper, testId: 'filter-btn' })

    /// Check call event
    testOn.isCalledEmitEvent({ wrapper }, 'on-click-filter')

    /// Update props value of isOpenFilterBlock
    await wrapper.setProps({ isOpenFilterBlock: true })

    /// Check exist class
    testOn.existClass({ wrapper, testId: 'filter-btn' }, 'v-btn--active')
  })

  it('Render content on config small', async () => {
    const wrapper = getMountListSearch(props)

    /// Check state content without config small
    testOn.existElement({ wrapper, testId: 'filter-btn-text' })
    testOn.notExistClasses({ wrapper, testId: 'filter-btn' }, 'filter-btn--small')

    await wrapper.setProps({ config: { ...props.config, small: true } })

    /// Check after set config small true
    testOn.notExistElement({ wrapper, testId: 'filter-btn-text' })
    testOn.existClass({ wrapper, testId: 'filter-btn' }, 'filter-btn--small')
  })

  it('Check call event on update search input ', async () => {
    vi.useFakeTimers()

    const newValue = 'Updated search input'

    const wrapper = getMountListSearch(props)

    testOn.existElement({ wrapper, testId: 'search-input' })

    await wrapper.find('input').setValue(newValue)

    /// Init fake timer on 0.5 sec
    vi.advanceTimersByTime(500)

    testOn.isEqualEmittedValue({ wrapper }, [[newValue]])

    /// Remove fake timer
    vi.useRealTimers()
  })
})
