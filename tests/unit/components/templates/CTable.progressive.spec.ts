import { h } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { enableAutoUnmount, flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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
  progressiveRender?: boolean
  draggable?: boolean
}

const TEST_IDS = {
  row: 'table-row',
  cellName: 'cell-name',
  progressRow: 'progressive-render-row',
}

const CHUNK = 200
const LARGE = CHUNK * 2 + 50

const makeRows = (count: number, prefix = 'r'): Row[] =>
  Array.from({ length: count }, (_, index) => ({ id: `${prefix}${index}`, name: `${prefix}${index}` }))

const getMountComponent = (props: Props): VueWrapper => setMountComponent(CTable)(props, {}, {
  'cell(name)': ({ item }: { item: { raw: Row } }) => h('span', { 'data-test-id': TEST_IDS.cellName }, item.raw.name),
})

const defaultProps: Props = {
  fields: [new TableField({ key: 'name', title: 'Name' })],
  rows: [],
  isLoadingList: false,
  itemsPerPage: -1,
  selectedItems: [],
  rowKey: row => row.id,
  rowMemo: () => [],
  progressiveRender: true,
}

let props: Props
let frames: Map<number, FrameRequestCallback>
let nextFrameId: number
const cancelAnimationFrameSpy = vi.fn((id: number) => frames.delete(id))

const runFrame = async () => {
  const pending = Array.from(frames.values())

  frames.clear()
  pending.forEach(callback => callback(performance.now()))
  await flushPromises()
}

const runAllFrames = async () => {
  while (frames.size)
    await runFrame()
}

const expectRowCount = (wrapper: VueWrapper, count: number) => {
  testOn.checkLengthElements({ wrapper, testId: TEST_IDS.row, all: true }, count)
}

const expectRowNames = (wrapper: VueWrapper, names: string[]) => {
  expectRowCount(wrapper, names.length)
  names.forEach((name, index) => {
    const selector = `${getSelectorTestId(TEST_IDS.row)}:nth-child(${index + 1}) ${getSelectorTestId(TEST_IDS.cellName)}`

    testOn.equalTextValue({ wrapper, selector }, name)
  })
}

describe('CTable progressive mount (progressiveRender + rowKey + rowMemo)', () => {
  enableAutoUnmount(afterEach)

  beforeEach(() => {
    props = { ...defaultProps }
    frames = new Map()
    nextFrameId = 0
    cancelAnimationFrameSpy.mockClear()
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(++nextFrameId, callback)

      return nextFrameId
    })
    vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrameSpy)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('a large list is drawn by chunks: first screen, then chunks per frame', async () => {
    const rows = makeRows(LARGE)
    const wrapper = getMountComponent({ ...props, rows })

    await flushPromises()
    expectRowCount(wrapper, CHUNK)

    await runFrame()
    expectRowCount(wrapper, CHUNK * 2)

    await runFrame()
    expectRowNames(wrapper, rows.map(row => row.name))
    expect(frames.size).toBe(0)
  })

  it('the progress row is shown while rows are being drawn and removed after', async () => {
    const wrapper = getMountComponent({ ...props, rows: makeRows(LARGE) })

    await flushPromises()
    testOn.existElement({ wrapper, testId: TEST_IDS.progressRow })

    await runAllFrames()
    testOn.notExistElement({ wrapper, testId: TEST_IDS.progressRow })
  })

  it('the progress row spans all columns, including the drag handle', async () => {
    const wrapper = getMountComponent({ ...props, rows: makeRows(LARGE), draggable: true })

    await flushPromises()

    // testOn has no generic attribute check: name column + drag handle column
    expect(wrapper.find(`${getSelectorTestId(TEST_IDS.progressRow)} td`).attributes('colspan')).toBe('2')
  })

  it('a list not bigger than a chunk is drawn at once', async () => {
    const wrapper = getMountComponent({ ...props, rows: makeRows(CHUNK) })

    await flushPromises()

    expectRowCount(wrapper, CHUNK)
    expect(frames.size).toBe(0)
  })

  it('small changes after the list is drawn are rendered at once (reorder, one new row)', async () => {
    const rows = makeRows(LARGE)
    const wrapper = getMountComponent({ ...props, rows })

    await flushPromises()
    await runAllFrames()

    const reversed = [...rows].reverse()

    await wrapper.setProps({ rows: reversed })
    await flushPromises()
    expect(frames.size).toBe(0)
    expectRowNames(wrapper, reversed.map(row => row.name))

    const withNewRow = [...makeRows(1, 'new'), ...reversed]

    await wrapper.setProps({ rows: withNewRow })
    await flushPromises()
    expect(frames.size).toBe(0)
    expectRowNames(wrapper, withNewRow.map(row => row.name))
  })

  it('a replaced list (new rows) is drawn by chunks again', async () => {
    const wrapper = getMountComponent({ ...props, rows: makeRows(LARGE) })

    await flushPromises()
    await runAllFrames()

    const replaced = makeRows(LARGE, 'other')

    await wrapper.setProps({ rows: replaced })
    await flushPromises()
    expectRowCount(wrapper, CHUNK)

    await runAllFrames()
    expectRowNames(wrapper, replaced.map(row => row.name))
  })

  it('a list replaced during drawing goes back to the first chunk instead of mounting the drawn part at once', async () => {
    const wrapper = getMountComponent({ ...props, rows: makeRows(LARGE) })

    await flushPromises()
    await runFrame()
    expectRowCount(wrapper, CHUNK * 2)

    const replaced = makeRows(LARGE, 'other')

    await wrapper.setProps({ rows: replaced })
    await flushPromises()
    expectRowNames(wrapper, replaced.slice(0, CHUNK).map(row => row.name))

    await runAllFrames()
    expectRowNames(wrapper, replaced.map(row => row.name))
  })

  it('a filter applied during drawing: only rows of the filtered list are in the DOM, in its order', async () => {
    const rows = makeRows(LARGE)
    const wrapper = getMountComponent({ ...props, rows })

    await flushPromises()
    await runFrame()

    const filtered = rows.filter((_, index) => index % 3 === 0).reverse()

    await wrapper.setProps({ rows: filtered })
    await flushPromises()
    expectRowNames(wrapper, filtered.slice(0, CHUNK * 2).map(row => row.name))

    await runAllFrames()
    expectRowNames(wrapper, filtered.map(row => row.name))
    testOn.notExistElement({ wrapper, testId: TEST_IDS.progressRow })
  })

  it('a search narrowing the list during drawing: exactly the found rows, no progress row', async () => {
    const rows = makeRows(LARGE)
    const wrapper = getMountComponent({ ...props, rows })

    await flushPromises()

    const found = [rows[420], rows[7], rows[300]]

    await wrapper.setProps({ rows: found })
    await flushPromises()
    expectRowNames(wrapper, found.map(row => row.name))
    testOn.notExistElement({ wrapper, testId: TEST_IDS.progressRow })

    await runAllFrames()
    expectRowNames(wrapper, found.map(row => row.name))
  })

  it('after the loading skeleton the same rows are drawn by chunks again', async () => {
    const rows = makeRows(LARGE)
    const wrapper = getMountComponent({ ...props, rows })

    await flushPromises()
    await runAllFrames()

    await wrapper.setProps({ isLoadingList: true })
    await flushPromises()
    testOn.notExistElement({ wrapper, testId: TEST_IDS.row })

    await wrapper.setProps({ isLoadingList: false })
    await flushPromises()
    expectRowCount(wrapper, CHUNK)
    testOn.existElement({ wrapper, testId: TEST_IDS.progressRow })

    await runAllFrames()
    expectRowNames(wrapper, rows.map(row => row.name))
  })

  it('reorder and a new row during drawing: drawn rows follow the list, the final DOM matches it', async () => {
    const rows = makeRows(LARGE)
    const wrapper = getMountComponent({ ...props, rows })

    await flushPromises()
    await runFrame()

    const reordered = [...makeRows(1, 'new'), ...[...rows].reverse()]

    await wrapper.setProps({ rows: reordered })
    await flushPromises()
    expectRowNames(wrapper, reordered.slice(0, CHUNK * 2).map(row => row.name))

    await runAllFrames()
    expectRowNames(wrapper, reordered.map(row => row.name))
  })

  it('unmount during drawing cancels the pending frame', async () => {
    const wrapper = getMountComponent({ ...props, rows: makeRows(LARGE) })

    await flushPromises()
    expect(frames.size).toBe(1)

    wrapper.unmount()

    expect(cancelAnimationFrameSpy).toHaveBeenCalled()
    expect(frames.size).toBe(0)
  })

  it('without progressiveRender a large list is drawn at once', async () => {
    const wrapper = getMountComponent({ ...props, rows: makeRows(LARGE), progressiveRender: false })

    await flushPromises()

    expectRowCount(wrapper, LARGE)
    expect(frames.size).toBe(0)
  })

  it('progressiveRender without rowMemo is ignored: a large list is drawn at once', async () => {
    const wrapper = getMountComponent({ ...props, rows: makeRows(LARGE), rowMemo: undefined })

    await flushPromises()

    expectRowCount(wrapper, LARGE)
    expect(frames.size).toBe(0)
  })
})
