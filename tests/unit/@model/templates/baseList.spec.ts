import { describe, expect, it } from 'vitest'
import { BaseListConfig } from '../../../../src/@model/templates/baseList'

const rowKey = (row: Record<string, unknown>) => String(row.id)
const rowMemo = () => []

describe('BaseListConfig row rendering options', () => {
  it('keeps rowMemo and progressiveRender when rowKey and rowMemo are set', () => {
    const config = new BaseListConfig({ rowKey, rowMemo, progressiveRender: true })

    expect(config.rowMemo).toBe(rowMemo)
    expect(config.progressiveRender).toBe(true)
  })

  it('drops rowMemo and progressiveRender without rowKey', () => {
    const config = new BaseListConfig({ rowMemo, progressiveRender: true })

    expect(config.rowMemo).toBeUndefined()
    expect(config.progressiveRender).toBeUndefined()
  })

  it('drops progressiveRender without rowMemo', () => {
    const config = new BaseListConfig({ rowKey, progressiveRender: true })

    expect(config.rowKey).toBe(rowKey)
    expect(config.progressiveRender).toBeUndefined()
  })
})
