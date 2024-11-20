import { beforeEach, describe, it } from 'vitest'
import ListSearch from '../../../../../../src/components/templates/BaseList/_components/ListSearch.vue'
import { getSelectorTestId, setMountComponent } from '../../../../utils'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'
import { IconsList } from '../../../../../../src/@model/enums/icons'

const getMountListSearch = setMountComponent(ListSearch)

const defaultProps = {
  config: {
    withSearch: true,
    searchPlaceholder: 'Search...',
    filterList: [],
    formatOfExports: [],
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

  /// TODO test cases
  /// Tender and call action on default slot content right-search-btn
  /// Check on exist export format selector and call event export-format-selected
  /// Render content on config.filterList?.isNotEmpty like sepa
  // rate test on render content  (isOpenFilterBlock, config?.small)
  /// Call event on update value of v-model="searchQuery"
})
