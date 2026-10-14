import { describe, expect, it } from 'vitest'
import { validate } from 'vee-validate'
import { NumberBaseField } from '../../../../../src/@model/templates/baseField/number'
import { NumberRangeBaseField } from '../../../../../src/@model/templates/baseField/number-range'
import { NUMBER_FIELD_MAX_VALUE } from '../../../../../src/utils/constants'
import '../../../../../src/@model/validations'

const createField = (overrides: Record<string, unknown> = {}) =>
  new NumberBaseField({ key: 'amount', label: 'Amount', ...overrides })

describe('NumberBaseField', () => {
  describe('default max_value', () => {
    it('adds the default when no validationRules are given', () => {
      expect(createField().validationRules).toEqual({ max_value: NUMBER_FIELD_MAX_VALUE })
    })

    it('keeps other rules and adds the default', () => {
      const field = createField({ validationRules: { required: true, min_value: 1 } })

      expect(field.validationRules).toEqual({ required: true, min_value: 1, max_value: NUMBER_FIELD_MAX_VALUE })
    })

    it.each([100, 10_000_000_000_000_000])('explicit max_value %s overrides the default', max => {
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
    it('keeps the default max_value', () => {
      expect(createField().clone().validationRules).toEqual({ max_value: NUMBER_FIELD_MAX_VALUE })
    })

    it('keeps an explicit override', () => {
      const clone = createField({ validationRules: { max_value: 100 } }).clone()

      expect(clone.validationRules).toEqual({ max_value: 100 })
    })

    it('re-applies the default when passed rules have no max_value', () => {
      const clone = createField().clone({ validationRules: { required: true } })

      expect(clone.validationRules).toEqual({ required: true, max_value: NUMBER_FIELD_MAX_VALUE })
    })
  })

  describe('setValidationRules', () => {
    it('replaces the rules entirely (default is lost)', () => {
      const field = createField().setValidationRules({ required: true })

      expect(field.validationRules).toEqual({ required: true })
    })
  })

  describe('validation with default rules', () => {
    it.each([
      [String(NUMBER_FIELD_MAX_VALUE), true],
      [String(NUMBER_FIELD_MAX_VALUE + 1), false],
      ['', true],
      ['-5', true],
      ['1.5', true],
    ])('value "%s" valid=%s', async (value, valid) => {
      const result = await validate(value, createField().validationRules as Record<string, unknown>, { name: 'amount', label: 'Amount' })

      expect(result.valid).toBe(valid)
    })

    it('error message contains the max number', async () => {
      const result = await validate(String(NUMBER_FIELD_MAX_VALUE + 1), createField().validationRules as Record<string, unknown>, { name: 'amount', label: 'Amount' })

      expect(result.errors[0]).toContain(String(NUMBER_FIELD_MAX_VALUE))
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
