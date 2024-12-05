import { beforeEach, describe, expect, it } from 'vitest'
import { cloneDeep } from 'lodash'
import CTable from '../../../../src/components/CTable/index.vue'
import { getSelectorTestId, setMountComponent } from '../../utils'
import { ListFieldType, TableField } from '../../../../src/@model/templates/tableFields'
import type { SelectMode } from '../../../../src/@model/enums/selectMode'
import type { SortItem } from '../../../../src/@core/types'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { SortDirection } from '../../../../src/@model/templates/baseList'

const getMountCTable = setMountComponent(CTable)

const mockFields = [
  new TableField({ key: 'isActive', title: 'Is active', type: ListFieldType.PillStatus }),
]

interface Props {
  fields: TableField[]
  rows: Array<Record<string, unknown>>
  class?: string
  hover?: boolean
  showEmpty?: boolean
  selectMode?: SelectMode
  selectable?: boolean
  small?: boolean
  draggable?: boolean
  sortData?: SortItem[]
  itemsPerPage: number
  selectedItems: Array<Record<string, unknown>>
  isLoadingList: boolean
  disabledRowIds?: string[]
  skeletonRows?: number
  skeletonCols?: number
}

const rows = mockFields.map(field => ({
  ...field,
  sortable: false,
  size: 'md',
}))

const defaultProps: Props = {
  fields: mockFields,
  rows,
  isLoadingList: false,
  itemsPerPage: 10,
  selectedItems: [],
}

const global = {}

const slots = {
  ...mockFields.reduce((acc, field) => ({
    ...acc,
    [`cell(${field.key})`]: `<div class="default-slot-content" data-test-id="slot-${field.key}">Content</div>`,
  }), {}),
}

let props

// const slots = {
//   'modal-header': '<div class="modal-header-slot">Custom Modal Header</div>',
//   'default': '<div class="default-slot-content">Custom Modal Content</div>',
// }

describe('CTable', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
  })

  it('Render default state of component with slots of cell', async () => {
    const wrapper = getMountCTable(props, global, slots)

    props.fields.forEach(field => {
      testOn.equalTextValue({ wrapper, testId: `slot-${field.key}` }, 'Content')
    })
  })

  it('Check isLoadingList activated state of component', async () => {
    props.isLoadingList = true

    const wrapper = getMountCTable(props, global, slots)

    testOn.existElement({ wrapper, testId: 'skeleton-loader' })

    expect(wrapper.find(getSelectorTestId('column-title')).attributes().style).toBe('display: none !important;')
    testOn.notExistClasses({ wrapper, testId: 'column-title' }, 'd-none')

    await wrapper.setProps({ ...props, draggable: true })

    /// Draggable elements on loading
    testOn.notExistElement({ wrapper, selector: `${getSelectorTestId('draggable-trigger')} i` })
  })

  it('Check isLoadingList not activated of component', async () => {
    props.draggable = true

    const wrapper = getMountCTable(props, global, slots)

    testOn.existClass({ wrapper, testId: 'column-title' }, 'd-none')

    /// Draggable elements on NOT loading
    testOn.existElement({ wrapper, selector: `${getSelectorTestId('draggable-trigger')} i` })
  })

  it('Check isHover activated of component', async () => {
    props.hover = true

    const wrapper = getMountCTable(props, global, slots)

    testOn.existClass({ wrapper, selector: '.c-table__row' }, 'is-hover-row')
  })

  it('Check selectMode activated of component', async () => {
    props.selectable = true

    const wrapper = getMountCTable(props, global, slots)

    testOn.existElement({ wrapper, testId: 'selectable-th' })
    testOn.existElement({ wrapper, testId: 'select-all-checkbox' })
    testOn.existElement({ wrapper, testId: 'selectable-checkbox' })
  })

  it('Check small activated of component', async () => {
    props.small = true

    const wrapper = getMountCTable(props, global, slots)

    props.fields.forEach(field => {
      testOn.existClassList({ wrapper, testId: `table-th-${field.key}` }, ['py-2', 'px-3'])
    })

    /// Make table selectable for check style on small mode
    await wrapper.setProps({ ...props, selectable: true })

    testOn.existClass({ wrapper, testId: 'selectable' }, 'px-0')
  })

  it('Check draggable activated of component', async () => {
    props.draggable = true

    const wrapper = getMountCTable(props, global, slots)

    testOn.existElement({ wrapper, testId: 'draggable-th' })
    testOn.existElement({ wrapper, testId: 'draggable-trigger' })
  })
  it('Render sort control icon by  sort params of component', async () => {
    const { key } = props.fields[0]

    props.fields = props.fields.map(field => ({
      ...field,
      sortable: true,
    }))

    props.sortData = [
      { key, order: SortDirection.asc, isActive: true },
    ]

    const wrapper = getMountCTable(props, global, slots)

    testOn.existElement({ wrapper, testId: `sort-col-${key}` })

    await wrapper.setProps({
      ...props,
      sortData: [
        { key, order: SortDirection.asc, isActive: true },
      ],
    })

    testOn.existClass({ wrapper, testId: `sort-icon-${SortDirection.asc}` }, 'c-table__header-cell-icon--active')
    testOn.notExistClasses({ wrapper, testId: `sort-icon-${SortDirection.desc}` }, 'c-table__header-cell-icon--active')

    await wrapper.setProps({
      ...props,
      sortData: [
        { key, order: SortDirection.desc, isActive: true },
      ],
    })

    testOn.notExistClasses({ wrapper, testId: `sort-icon-${SortDirection.asc}` }, 'c-table__header-cell-icon--active')
    testOn.existClass({ wrapper, testId: `sort-icon-${SortDirection.desc}` }, 'c-table__header-cell-icon--active')

    //
    // testOn.existElement({ wrapper, testId: `sort-col-${key}` })
  })
})
