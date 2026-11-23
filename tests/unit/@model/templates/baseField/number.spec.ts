import { describe, expect, it } from 'vitest'
import { validate } from 'vee-validate'
import { NumberBaseField } from '../../../../../src/@model/templates/baseField/number'
import { NumberRangeBaseField } from '../../../../../src/@model/templates/baseField/number-range'
import '../../../../../src/@model/validations'

const createField = (overrides: Record<string, unknown> = {}) =>
  new NumberBaseField({ key: 'amount', label: 'Amount', ...overrides })

describe('NumberBaseField', () => {
  describe('validationRules', () => {
    it('does not add a default max_value when no validationRules are given', () => {
      expect(createField().validationRules).toEqual({})
    })

    it('keeps other rules and does not add a default max_value', () => {
      const field = createField({ validationRules: { required: true, min_value: 1 } })

      expect(field.validationRules).toEqual({ required: true, min_value: 1 })
    })

    it.each([100, 10_000_000_000_000_000])('keeps explicit max_value %s', max => {
      const field = createField({ validationRules: { max_value: max } })

      expect(field.validationRules).toEqual({ max_value: max })
    })

    it('does not mutate the passed validationRules object', () => {
      const rules = { required: true }

      createField({ validationRules: rules })

      expect(rules).toEqual({ required: true })
    })
  })

  describe('value and meta', () => {
    it('defaults value to empty string', () => {
      expect(createField().value).toBe('')
    })

    it('keeps passed value, key and label', () => {
      const field = createField({ value: 42 })

      expect(field.value).toBe(42)
      expect(field.key).toBe('amount')
      expect(field.label).toBe('Amount')
    })
  })

  describe('clone', () => {
    it('does not add a default max_value', () => {
      expect(createField().clone().validationRules).toEqual({})
    })

    it('keeps an explicit max_value', () => {
      const clone = createField({ validationRules: { max_value: 100 } }).clone()

      expect(clone.validationRules).toEqual({ max_value: 100 })
    })

    it('uses passed rules as is', () => {
      const clone = createField().clone({ validationRules: { required: true } })

      expect(clone.validationRules).toEqual({ required: true })
    })
  })

  describe('setValidationRules', () => {
    it('replaces the rules entirely', () => {
      const field = createField({ validationRules: { max_value: 100 } }).setValidationRules({ required: true })

      expect(field.validationRules).toEqual({ required: true })
    })
  })

  describe('validation', () => {
    const check = (value: string, rules: Record<string, unknown>) =>
      validate(value, rules, { name: 'amount', label: 'Amount' })

    it('has no upper limit without an explicit max_value', async () => {
      const result = await check('1000000000000000000000', createField().validationRules as Record<string, unknown>)

      expect(result.valid).toBe(true)
    })

    it.each([
      ['100', true],
      ['101', false],
      ['', true],
      ['-5', true],
      ['1.5', true],
    ])('explicit max_value 100: value "%s" valid=%s', async (value, valid) => {
      const field = createField({ validationRules: { max_value: 100 } })
      const result = await check(value, field.validationRules as Record<string, unknown>)

      expect(result.valid).toBe(valid)
    })

    it('error message contains the max number and the label', async () => {
      const field = createField({ validationRules: { max_value: 100 } })
      const result = await check('101', field.validationRules as Record<string, unknown>)

      expect(result.errors[0]).toContain('100')
      expect(result.errors[0]).toContain('Amount')
    })
  })
})

describe('NumberRangeBaseField', () => {
  it('does not receive default validationRules', () => {
    const field = new NumberRangeBaseField({ key: 'range', label: 'Range' })

    expect(field.validationRules).toBeUndefined()
  })

  it('keeps passed validationRules untouched', () => {
    const field = new NumberRangeBaseField({ key: 'range', label: 'Range', validationRules: { required: true } })

    expect(field.validationRules).toEqual({ required: true })
  })
})
