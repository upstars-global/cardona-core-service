import { describe, expect, it } from 'vitest'
import { validate } from 'vee-validate'
import '../../../src/@model/validations'
import { NUMBER_FIELD_MAX_VALUE } from '../../../src/utils/constants'

const MAX = NUMBER_FIELD_MAX_VALUE

const check = (value: unknown, label = 'Range') =>
  validate(value, { range_max_value: MAX } as Record<string, unknown>, { name: 'range', label })

describe('range_max_value rule', () => {
  it.each([
    [{ from: 1, to: 100 }],
    [{ from: '1', to: '100' }],
    [{ from: '0', to: String(MAX) }],
    [{ from: '', to: '' }],
    [{ from: '', to: '5' }],
    [{ from: null, to: undefined }],
    [{ from: -10, to: -1 }],
    [{ from: String(-MAX - 1), to: '-5' }],
    [null],
    [undefined],
    ['not-an-object'],
  ])('passes for %j', async value => {
    expect((await check(value)).valid).toBe(true)
  })

  it.each([
    [{ from: 1, to: MAX + 1 }],
    [{ from: '1', to: String(MAX + 1) }],
    [{ from: String(MAX + 1), to: '' }],
    [{ from: '', to: MAX + 0.5 }],
    [{ from: 'abc', to: '1' }],
    [{ from: '1', to: 'abc' }],
  ])('fails for %j', async value => {
    expect((await check(value)).valid).toBe(false)
  })

  it('produces the max_value message with max and label', async () => {
    const result = await check({ from: 1, to: MAX + 1 }, 'Amount')

    expect(result.errors).toEqual([`The Amount field must be ${MAX} or less`])
  })
})

describe('max_value rule message', () => {
  it('contains the max number', async () => {
    const result = await validate(String(MAX + 1), { max_value: MAX } as Record<string, unknown>, { name: 'f', label: 'Amount' })

    expect(result.errors).toEqual([`The Amount field must be ${MAX} or less`])
  })
})
