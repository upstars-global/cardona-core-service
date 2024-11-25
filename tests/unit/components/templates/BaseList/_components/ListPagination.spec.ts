import { beforeEach, describe, expect, it } from 'vitest'
import { computed, ref } from 'vue'
import ListPagination from '../../../../../../src/components/templates/BaseList/_components/ListPagination.vue'
import { clickTrigger, setMountComponent } from '../../../../utils'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'

const getMountListPagination = setMountComponent(ListPagination)

const perPageOptions = [10, 20, 50, 100]

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

const activeClassMarker = 'v-pagination__item--is-active'

const defaultProps = {
  paginationConfig: getPaginationConfig({ total: 100, perPage: 10, currentPage: 1 }),
  linkGen: () => {},
  dataMeta: { from: 1, to: 10, of: 100 }, /// {from: (currentPage * perPage)  + 1, to: (currentPage * perPage) }, /// total: paginationConfig.total.value
  modelValue: 1,
  small: false,
}

let props
beforeEach(() => {
  props = defaultProps
})

// console.log(getPaginationConfig({ total: 100, perPage: 10, currentPage: 2 }), '***')
//
// props.paginationConfig = getPaginationConfig({ total: 100, perPage: 10, currentPage: 2 })
// props.modelValue = 1
// props.dataMeta = { from: 1, to: 10, of: 100 }

describe('ListPagination.vue', () => {
  it('Render base elements', () => {
    const wrapper = getMountListPagination(props)

    testOn.existElement({ wrapper, selector: `.${activeClassMarker}` })
    testOn.equalTextValue({ wrapper, selector: `.${activeClassMarker}` }, props.modelValue.toString())
  })

  it('Check on call event model value', async () => {
    const wrapper = getMountListPagination(props)

    await clickTrigger({ wrapper, testId: `page-${2}` })

    // testOn.isCalledEmitEventValue(wrapper, { event: 'update:modelValue', value: '2', index: 0 })
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe(2) /// TODO FIX test
  })
})
