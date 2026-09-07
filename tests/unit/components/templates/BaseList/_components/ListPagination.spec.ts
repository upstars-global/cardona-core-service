import { beforeEach, describe, it } from 'vitest'
import { computed, ref } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import ListPagination from '../../../../../../src/components/templates/BaseList/_components/ListPagination.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../../../utils'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'
import { i18n } from '../../../../../../src/plugins/i18n'
import { VColors } from '../../../../../../src/@model/vuetify'

const getMountListPagination = setMountComponent(ListPagination)

const perPageOptions = [10, 20, 50, 100]

/// Test on pagination config
const getPaginationConfig = ({ total, perPage, currentPage }) => ({
  linkGen: (pageNum: number) => `page=${pageNum}`,
  currentPage: ref(currentPage),
  perPageOptions,
  perPage: ref(perPage),
  total: ref(total),
  setupDataMeta: (refTable: any) =>
    computed(() => {
      const start = (currentPage - 1) * perPage + 1
      const end = Math.min(start + perPage - 1, total)

      return { from: start, to: end, of: total }
    }),
  numberOfPages: computed(() => Math.ceil(total / perPage)),
  setPerPage: (value: number) => {
    perPage = value
  },
  setPage: (page?: number, perPageProps?: any) => {
    if (page)
      currentPage = page

    if (perPageProps)
      perPage = perPageProps
  },
  removePerPage: () => {
    perPage = 0
  },
  removePagination: () => {
    perPage = 0
    currentPage = 1
  },
  updateTotal: (value: number) => {
    total = value
  },
  onChangePagination: (cb: Function) => {
    return cb()
  },
})

const activeClassMarker = '.v-pagination__item--is-active'

const defaultProps = {
  paginationConfig: getPaginationConfig({ total: 100, perPage: 10, currentPage: 1 }),
  linkGen: () => {},
  dataMeta: { from: 1, to: 10, of: 100 },
  modelValue: 1,
  small: false,
}

let props
beforeEach(() => {
  props = { ...defaultProps }
})

const isExistButtonsByNumberList = (wrapper: VueWrapper, numbers: Array<number>) => {
  numbers.forEach(numberButton => {
    testOn.existElement({ wrapper, testId: `page-${numberButton}` })
  })
}

describe('ListPagination.vue', () => {
  it('Render base elements', () => {
    const wrapper = getMountListPagination(props)

    testOn.existElement({ wrapper, selector: activeClassMarker })
    testOn.equalTextValue({ wrapper, selector: activeClassMarker }, props.modelValue.toString())
  })

  it('Check style pagination button classes by state', () => {
    const wrapper = getMountListPagination(props)

    /// Test on active button
    testOn.existClass({ wrapper, selector: `${activeClassMarker} button` }, `text-${VColors.Primary}`)

    /// Test on not active button
    testOn.existClass({ wrapper, testId: 'page-2' }, `text-${VColors.Secondary}`)

    /// Test on disabled button
    testOn.existClass({ wrapper, testId: 'ellipsis' }, 'v-btn--disabled')
  })

  it('Check on call event model value', async () => {
    const wrapper = getMountListPagination(props)

    await clickTrigger({ wrapper, testId: `page-${2}` })

    testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'update:modelValue', value: 2, index: 0 })
  })

  it('Check correct render count button number page', () => {
    props.paginationConfig = getPaginationConfig({ total: 20, perPage: 10, currentPage: 1 })

    const wrapper = getMountListPagination(props)

    const pagesNumbers = [1, 2]

    isExistButtonsByNumberList(wrapper, pagesNumbers)
  })

  it('Check on params with params small size pagination', () => {
    props.small = true

    const wrapper = getMountListPagination(props)

    /// Test on not exist buttons
    const buttonNumberWhichAbsent = [4, 5]

    buttonNumberWhichAbsent.forEach(numberButton => {
      testOn.notExistElement({ wrapper, testId: `page-${numberButton}` })
    })

    /// Test on exist buttons
    const buttonNumbersWhichExist = [1, 2, 3, 10]

    isExistButtonsByNumberList(wrapper, buttonNumbersWhichExist)

    const paginationNavigationButtons = [
      '.v-pagination__prev',
      '.v-pagination__next',
    ]

    paginationNavigationButtons.forEach(selector => {
      testOn.existClass({ wrapper, selector: `${selector} button` }, 'v-btn--size-small')
    })
  })

  it('Is correct render meta data', () => {
    const wrapper = getMountListPagination(props)

    testOn.equalTextValue({ wrapper, testId: 'pagination-meta' }, i18n.t('pagination.showing', props.dataMeta))
  })

  describe('Go to page field', () => {
    const goToPageInput = (wrapper: VueWrapper) =>
      wrapper.find(`${getSelectorTestId('pagination-go-to-input')} input`)

    const setGoToPageValue = async (wrapper: VueWrapper, value: string) => {
      await goToPageInput(wrapper).setValue(value)
    }

    beforeEach(() => {
      props.withGoToPage = true
    })

    it('Is not rendered without withGoToPage prop', () => {
      props.withGoToPage = false

      testOn.notExistElement({ wrapper: getMountListPagination(props), testId: 'pagination-go-to' })
    })

    it('Is not rendered when there is only one page', () => {
      props.paginationConfig = getPaginationConfig({ total: 10, perPage: 10, currentPage: 1 })

      testOn.notExistElement({ wrapper: getMountListPagination(props), testId: 'pagination-go-to' })
    })

    it('Goes to the entered page and clears the field', async () => {
      const wrapper = getMountListPagination(props)

      await setGoToPageValue(wrapper, '5')
      await goToPageInput(wrapper).trigger('keydown.enter')

      testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'update:modelValue', value: 5, index: 0 })
      testOn.inputAttributeValueToBe(
        { wrapper, selector: `${getSelectorTestId('pagination-go-to-input')} input` }, '',
      )
    })

    it('Goes to the first page when the value is less than one', async () => {
      props.modelValue = 5

      const wrapper = getMountListPagination(props)

      await setGoToPageValue(wrapper, '0')
      await clickTrigger({ wrapper, testId: 'pagination-go-to-button' })

      testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'update:modelValue', value: 1, index: 0 })
    })

    it('Goes to the last page when the value is greater than the number of pages', async () => {
      const wrapper = getMountListPagination(props)

      await setGoToPageValue(wrapper, '32')
      await clickTrigger({ wrapper, testId: 'pagination-go-to-button' })

      testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'update:modelValue', value: 10, index: 0 })
    })

    it('Does nothing on empty value', async () => {
      const wrapper = getMountListPagination(props)

      await clickTrigger({ wrapper, testId: 'pagination-go-to-button' })

      testOn.isNotCalledEmittedEvent({ wrapper })
    })
  })
})
