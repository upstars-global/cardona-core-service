import { h, ref } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { enableAutoUnmount, flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import CTable from '../../../../src/components/CTable/index.vue'
import { getSelectorTestId, setMountComponent } from '../../utils'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { TableField } from '../../../../src/@model/templates/tableFields'
import type { BaseListRowKey, BaseListRowMemo } from '../../../../src/@model/templates/baseList'

interface Row { id: string; name: string }

interface Props {
  fields: TableField[]
  rows: Row[]
  isLoadingList: boolean
  itemsPerPage: number
  selectedItems: Row[]
  rowKey: BaseListRowKey
  rowMemo?: BaseListRowMemo
}

const TEST_IDS = {
  row: 'table-row',
  cellName: 'cell-name',
}

const makeRows = (ids: string[]): Row[] => ids.map(id => ({ id, name: `name-${id}` }))

const memoDeps = ref(0)
let renderedRowIds: string[] = []

const getMountComponent = (props: Props): VueWrapper => setMountComponent(CTable)(props, {}, {
  'cell(name)': ({ item }: { item: { raw: Row } }) => {
    renderedRowIds.push(item.raw.id)

    return h('span', { 'data-test-id': TEST_IDS.cellName }, item.raw.name)
  },
})

const defaultProps: Props = {
  fields: [new TableField({ key: 'name', title: 'Name' })],
  rows: [],
  isLoadingList: false,
  itemsPerPage: 1000,
  selectedItems: [],
  rowKey: row => row.id,
  rowMemo: () => [memoDeps.value],
}

let props: Props

const mountWithRows = async (rows: Row[], override: Partial<Props> = {}) => {
  const wrapper = getMountComponent({ ...props, rows, ...override })

  await flushPromises()
  renderedRowIds = []

  return wrapper
}

const setRows = async (wrapper: VueWrapper, rows: Row[]) => {
  renderedRowIds = []
  await wrapper.setProps({ rows })
  await flushPromises()
}

const expectRowNames = (wrapper: VueWrapper, names: string[]) => {
  testOn.checkLengthElements({ wrapper, testId: TEST_IDS.row, all: true }, names.length)
  names.forEach((name, index) => {
    const selector = `${getSelectorTestId(TEST_IDS.row)}:nth-child(${index + 1}) ${getSelectorTestId(TEST_IDS.cellName)}`

    testOn.equalTextValue({ wrapper, selector }, name)
  })
}

describe('CTable row cache by key (rowKey + rowMemo)', () => {
  enableAutoUnmount(afterEach)

  beforeEach(() => {
    props = { ...defaultProps }
    memoDeps.value = 0
    renderedRowIds = []
  })

  it('renders every row once on mount', async () => {
    const wrapper = getMountComponent({ ...props, rows: makeRows(['a', 'b', 'c']) })

    await flushPromises()

    expectRowNames(wrapper, ['name-a', 'name-b', 'name-c'])
    expect(renderedRowIds).toEqual(['a', 'b', 'c'])
  })

  it('reorder: DOM follows rows, no row is re-rendered', async () => {
    const rows = makeRows(['a', 'b', 'c', 'd'])
    const wrapper = await mountWithRows(rows)

    await setRows(wrapper, [rows[3], rows[1], rows[0], rows[2]])

    expectRowNames(wrapper, ['name-d', 'name-b', 'name-a', 'name-c'])
    expect(renderedRowIds).toEqual([])
  })

  it('remove the first row: remaining rows are kept, not re-rendered', async () => {
    const rows = makeRows(['a', 'b', 'c'])
    const wrapper = await mountWithRows(rows)

    await setRows(wrapper, rows.slice(1))

    expectRowNames(wrapper, ['name-b', 'name-c'])
    expect(renderedRowIds).toEqual([])
  })

  it('insert at the top: only the new row is rendered', async () => {
    const rows = makeRows(['a', 'b'])
    const wrapper = await mountWithRows(rows)

    await setRows(wrapper, [...makeRows(['new']), ...rows])

    expectRowNames(wrapper, ['name-new', 'name-a', 'name-b'])
    expect(renderedRowIds).toEqual(['new'])
  })

  it('changed row object: only that row is re-rendered', async () => {
    const rows = makeRows(['a', 'b', 'c'])
    const wrapper = await mountWithRows(rows)

    await setRows(wrapper, [rows[0], { id: 'b', name: 'updated-b' }, rows[2]])

    expectRowNames(wrapper, ['name-a', 'updated-b', 'name-c'])
    expect(renderedRowIds).toEqual(['b'])
  })

  it('rowMemo dependency change alone re-renders all rows', async () => {
    await mountWithRows(makeRows(['a', 'b']))

    memoDeps.value++
    await flushPromises()

    expect(renderedRowIds).toEqual(['a', 'b'])
  })

  it('selection change re-renders only the selected row', async () => {
    const rows = makeRows(['a', 'b', 'c'])
    const wrapper = await mountWithRows(rows)

    await wrapper.setProps({ selectedItems: [rows[1]] })
    await flushPromises()

    expect(renderedRowIds).toEqual(['b'])
  })

  it('rows are restored correctly after the loading skeleton', async () => {
    const rows = makeRows(['a', 'b', 'c'])
    const wrapper = await mountWithRows(rows)

    await wrapper.setProps({ isLoadingList: true })
    await flushPromises()
    testOn.notExistElement({ wrapper, testId: TEST_IDS.row })

    await wrapper.setProps({ isLoadingList: false, rows: [rows[2], rows[0], rows[1]] })
    await flushPromises()
    expectRowNames(wrapper, ['name-c', 'name-a', 'name-b'])
  })

  it('a removed row coming back is rendered again (cache entry was dropped)', async () => {
    const rows = makeRows(['a', 'b'])
    const wrapper = await mountWithRows(rows)

    await setRows(wrapper, [rows[1]])
    await setRows(wrapper, rows)

    expectRowNames(wrapper, ['name-a', 'name-b'])
    expect(renderedRowIds).toEqual(['a'])
  })

  it('duplicate row keys are rendered without the cache and keep the DOM consistent', async () => {
    const rows = makeRows(['a', 'b'])
    const wrapper = await mountWithRows(rows)

    await setRows(wrapper, [rows[0], rows[1], rows[0]])
    expectRowNames(wrapper, ['name-a', 'name-b', 'name-a'])

    await setRows(wrapper, [rows[1], rows[0]])
    expectRowNames(wrapper, ['name-b', 'name-a'])
  })

  it('without rowMemo every row is rendered on each rows change (no cache)', async () => {
    const rows = makeRows(['a', 'b', 'c'])
    const wrapper = await mountWithRows(rows, { rowMemo: undefined })

    await setRows(wrapper, [rows[2], rows[0], rows[1]])

    expectRowNames(wrapper, ['name-c', 'name-a', 'name-b'])
    expect([...renderedRowIds].sort()).toEqual(['a', 'b', 'c'])
  })
})
