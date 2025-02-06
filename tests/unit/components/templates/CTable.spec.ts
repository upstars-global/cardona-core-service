import { beforeEach, describe, it } from 'vitest'
import { cloneDeep } from 'lodash'
import CTable from '../../../../src/components/CTable/index.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../utils'
import { ListFieldType, TableField } from '../../../../src/@model/templates/tableFields'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { SortDirection } from '../../../../src/@model/templates/baseList'

const mockFields = [
  new TableField({ key: 'isActive', title: 'Is active', type: ListFieldType.PillStatus }),
]

const getMountCTable = props => setMountComponent(CTable)(props, {}, {
  ...mockFields.reduce((acc, field) => ({
    ...acc,
    [`cell(${field.key})`]: `<div class="default-slot-content" data-test-id="slot-${field.key}">Content</div>`,
  }), {}),
})

const rows = mockFields.map(field => ({
  ...field,
  sortable: false,
  size: 'md',
}))

const defaultProps = {
  fields: mockFields,
  rows,
  isLoadingList: false,
  itemsPerPage: 10,
  selectedItems: [],
}

let props

describe('CTable', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
  })

  it('Render default state of component with slots of cell', async () => {
    const wrapper = getMountCTable(props)

    props.fields.forEach(field => {
      testOn.equalTextValue({ wrapper, testId: `slot-${field.key}` }, 'Content')
    })
  })

  it('Check isLoadingList activated state of component', async () => {
    props.isLoadingList = true

    const wrapper = getMountCTable(props)

    testOn.existElement({ wrapper, testId: 'skeleton-loader' })

    testOn.isEqualAttributeStyle({ wrapper, testId: 'column-title' }, 'display: none !important;')
    testOn.notExistClasses({ wrapper, testId: 'column-title' }, 'd-none')

    await wrapper.setProps({ ...props, draggable: true })

    /// Draggable elements on loading
    testOn.notExistElement({ wrapper, selector: `${getSelectorTestId('draggable-trigger')} i` })
  })

  it('Check draggable not activated of component', async () => {
    props.draggable = true

    const wrapper = getMountCTable(props)

    testOn.existClass({ wrapper, testId: 'column-title' }, 'd-none')

    /// Draggable elements on NOT loading
    testOn.existElement({ wrapper, selector: `${getSelectorTestId('draggable-trigger')} i` })
  })

  it('Check isHover activated of component', async () => {
    props.hover = true

    const wrapper = getMountCTable(props)

    testOn.existClass({ wrapper, selector: '.c-table__row' }, 'is-hover-row')
  })

  it('Check selectMode activated of component', async () => {
    props.selectable = true

    const wrapper = getMountCTable(props)

    testOn.existElement({ wrapper, testId: 'selectable-th' })
    testOn.existElement({ wrapper, testId: 'select-all-checkbox' })
    testOn.existElement({ wrapper, testId: 'selectable-checkbox' })
  })

  it('Check small activated of component', async () => {
    props.small = true

    const wrapper = getMountCTable(props)

    props.fields.forEach(field => {
      testOn.existClassList({ wrapper, testId: `table-th-${field.key}` }, ['py-2', 'px-3'])
    })

    /// Make table selectable for check style on small mode
    await wrapper.setProps({ ...props, selectable: true })

    testOn.existClass({ wrapper, testId: 'selectable' }, 'px-0')
  })

  it('Check draggable activated of component', async () => {
    props.draggable = true

    const wrapper = getMountCTable(props)

    testOn.existElement({ wrapper, testId: 'draggable-th' })
    testOn.existElement({ wrapper, testId: 'draggable-trigger' })
  })

  it('Render sort control icon by sort params of component and call event', async () => {
    const { key } = props.fields[0]

    props.fields = props.fields.map(field => ({
      ...field,
      sortable: true,
    }))

    props.sortData = [
      { key, order: SortDirection.asc, isActive: true },
    ]

    const wrapper = getMountCTable(props)

    testOn.existElement({ wrapper, testId: `sort-col-${key}` })

    /// Set sort direction to ASC by click
    await clickTrigger({ wrapper, testId: `sort-icon-${SortDirection.asc}` })

    const emittedValueForASC = wrapper.emitted('update:sortData')[0][0]

    /// Check that is emitted correct value
    testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'update:sortData', value: emittedValueForASC })

    /// Update props
    await wrapper.setProps({
      ...props,
      sortData: emittedValueForASC,
    })

    /// Check that is correct active type of sort icon (ASC)
    testOn.existClass({ wrapper, testId: `sort-icon-${SortDirection.asc}` }, 'c-table__header-cell-icon--active')
    testOn.notExistClasses({ wrapper, testId: `sort-icon-${SortDirection.desc}` }, 'c-table__header-cell-icon--active')

    /// Set sort direction to DESC by click
    await clickTrigger({ wrapper, testId: `sort-icon-${SortDirection.desc}` })

    const emittedValueForDESC = wrapper.emitted('update:sortData')[1][0]

    /// Check that is emitted correct value
    testOn.isCalledEmitEventValueToBe({ wrapper }, { event: 'update:sortData', value: emittedValueForDESC, index: 1 })

    await wrapper.setProps({
      ...props,
      sortData: emittedValueForDESC,
    })

    /// Check that is correct active type of sort icon (DESC)
    testOn.notExistClasses({ wrapper, testId: `sort-icon-${SortDirection.asc}` }, 'c-table__header-cell-icon--active')
    testOn.existClass({ wrapper, testId: `sort-icon-${SortDirection.desc}` }, 'c-table__header-cell-icon--active')
  })

  it('Check render element of skeleton by perPage', async () => {
    const itemsPerPage = 5

    props.itemsPerPage = itemsPerPage
    props.isLoadingList = true

    /// Check skeleton rows of qunatity
    const wrapper = getMountCTable(props)

    testOn.checkLengthElements({ wrapper, testId: 'skeleton-row', all: true }, itemsPerPage)

    /// Set to large quantity of skeleton rows
    await wrapper.setProps({ ...props, itemsPerPage: 125 })

    /// Check skeleton rows is not be more than 25
    testOn.checkLengthElements({ wrapper, testId: 'skeleton-row', all: true }, 25)
  })

  it('Check that selectable check box is disabled by disabledRowIds ', async () => {
    props.selectable = true
    props.rows = Array.from({ length: 5 }, (_, index) => ({
      ...rows[0],
      id: index,
    }))

    props.disabledRowIds = [2, 4]

    const wrapper = getMountCTable(props)

    props.disabledRowIds.forEach(index => {
      const wrapperCheckbox = wrapper.findAll(getSelectorTestId('selectable-checkbox')).at(index)

      testOn.existClass({ wrapper: wrapperCheckbox }, 'v-input--disabled')
    })
  })

  it('Render quantity of skeleton rows on loading by skeletonRows', async () => {
    props.skeletonRows = 125
    props.isLoadingList = true

    const wrapper = getMountCTable(props)

    testOn.checkLengthElements({ wrapper, testId: 'skeleton-row', all: true }, props.skeletonRows)
  })
})
