import { describe, it } from 'vitest'
import CTable from '../../../../src/components/CTable/index.vue'
import { setMountComponent } from '../../utils'
import { ListFieldType, TableField } from '../../../../src/@model/templates/tableFields'
import type { SelectMode } from '../../../../src/@model/enums/selectMode'
import type { SortItem } from '../../../../src/@core/types'
import { testOn } from '../../templates/shared-tests/test-case-generator'

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
  [`cell(${rows[0].key})`]: `<div class="default-slot-content" data-test-id="slot-${rows[0].key}">Content</div>`,
}

// const slots = {
//   'modal-header': '<div class="modal-header-slot">Custom Modal Header</div>',
//   'default': '<div class="default-slot-content">Custom Modal Content</div>',
// }

describe('CTable', () => {
  it('Render default state of component', async () => {
    const wrapper = getMountCTable(defaultProps, global, slots)

    testOn.equalTextValue({ wrapper, testId: `slot-${rows[0].key}` }, 'Content')

    console.log(wrapper.html())
  })
})
