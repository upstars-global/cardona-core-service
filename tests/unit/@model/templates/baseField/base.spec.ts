import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TextBaseField } from '../../../../../src/@model/templates/baseField/text'
import type { IValidationConfig } from '../../../../../src/@model/validations'

// TextBaseField is the simplest concrete subclass of BaseField and is used
// throughout these tests to exercise BaseField behaviour.

const createField = (overrides: Record<string, unknown> = {}) =>
  new TextBaseField({
    key: 'test-key',
    label: 'Test Label',
    placeholder: 'Test Placeholder',
    description: 'Test Description',
    info: 'Test Info',
    validationRules: { required: true },
    ...overrides,
  })

describe('BaseField', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  // ─── constructor ────────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('assigns key from field config', () => {
      const field = createField()

      expect(field.key).toBe('test-key')
    })

    it('defaults id to key when id is not provided', () => {
      const field = createField()

      expect(field.id).toBe('test-key')
    })

    it('assigns custom id when provided', () => {
      const field = createField({ id: 'custom-id' })

      expect(field.id).toBe('custom-id')
    })

    it('assigns validationRules from field config', () => {
      const field = createField({ validationRules: { required: true, min: 3 } })

      expect(field.validationRules).toEqual({ required: true, min: 3 })
    })
  })

  // ─── getters ────────────────────────────────────────────────────────────────

  describe('label getter', () => {
    it('returns the label passed in constructor', () => {
      const field = createField({ label: 'My Label' })

      expect(field.label).toBe('My Label')
    })

    it('returns empty string when label is not provided', () => {
      const field = createField({ label: undefined })

      expect(field.label).toBe('')
    })
  })

  describe('placeholder getter', () => {
    it('returns the placeholder passed in constructor', () => {
      const field = createField({ placeholder: 'Enter value' })

      expect(field.placeholder).toBe('Enter value')
    })

    it('returns undefined when placeholder is not provided', () => {
      const field = createField({ placeholder: undefined })

      expect(field.placeholder).toBeUndefined()
    })
  })

  describe('description getter', () => {
    it('returns the description passed in constructor', () => {
      const field = createField({ description: 'Some description' })

      expect(field.description).toBe('Some description')
    })

    it('returns undefined when description is not provided', () => {
      const field = createField({ description: undefined })

      expect(field.description).toBeUndefined()
    })
  })

  describe('info getter', () => {
    it('returns the info passed in constructor', () => {
      const field = createField({ info: 'Some info' })

      expect(field.info).toBe('Some info')
    })

    it('returns undefined when info is not provided', () => {
      const field = createField({ info: undefined })

      expect(field.info).toBeUndefined()
    })
  })

  // ─── value ──────────────────────────────────────────────────────────────────

  describe('value getter / setter', () => {
    it('sets and gets a value', () => {
      const field = createField()

      field.value = 'hello'

      expect(field.value).toBe('hello')
    })

    it('applies custom serialize and deserialize', () => {
      const field = createField({
        serialize: (v: string) => v.toUpperCase(),
        deserialize: (v: string) => v.toLowerCase(),
      })

      field.value = 'Hello'

      expect(field.value).toBe('hello')
    })
  })

  // ─── clone ──────────────────────────────────────────────────────────────────

  describe('clone()', () => {
    it('returns a new instance of the same class', () => {
      const field = createField()
      const cloned = field.clone()

      expect(cloned).toBeInstanceOf(TextBaseField)
      expect(cloned).not.toBe(field)
    })

    it('preserves original field values', () => {
      const field = createField({ label: 'Original' })
      const cloned = field.clone()

      expect(cloned.label).toBe('Original')
    })

    it('overrides properties when params are passed', () => {
      const field = createField({ label: 'Original' })
      const cloned = field.clone({ label: 'Overridden' })

      expect(cloned.label).toBe('Overridden')
    })

    it('copies current value when no value override is given', () => {
      const field = createField()

      field.value = 'stored'

      const cloned = field.clone()

      expect(cloned.value).toBe('stored')
    })

    it('uses provided value when value override is given', () => {
      const field = createField()

      field.value = 'original'

      const cloned = field.clone({ value: 'new' })

      expect(cloned.value).toBe('new')
    })
  })

  // ─── transformField ──────────────────────────────────────────────────────────

  describe('transformField()', () => {
    it('returns the raw internal value', () => {
      const field = createField()

      field.value = 'raw'

      expect(field.transformField()).toBe('raw')
    })
  })

  // ─── setLabel ────────────────────────────────────────────────────────────────

  describe('setLabel()', () => {
    it('updates the label', () => {
      const field = createField({ label: 'Old' })

      field.setLabel('New Label')

      expect(field.label).toBe('New Label')
    })

    it('returns the same instance for chaining', () => {
      const field = createField()

      expect(field.setLabel('New')).toBe(field)
    })
  })

  // ─── setPlaceholder ──────────────────────────────────────────────────────────

  describe('setPlaceholder()', () => {
    it('updates the placeholder', () => {
      const field = createField({ placeholder: 'Old' })

      field.setPlaceholder('New Placeholder')

      expect(field.placeholder).toBe('New Placeholder')
    })

    it('returns the same instance for chaining', () => {
      const field = createField()

      expect(field.setPlaceholder('New')).toBe(field)
    })
  })

  // ─── setDescription ──────────────────────────────────────────────────────────

  describe('setDescription()', () => {
    it('updates the description', () => {
      const field = createField({ description: 'Old' })

      field.setDescription('New Description')

      expect(field.description).toBe('New Description')
    })

    it('returns the same instance for chaining', () => {
      const field = createField()

      expect(field.setDescription('New')).toBe(field)
    })
  })

  // ─── setInfo ────────────────────────────────────────────────────────────────

  describe('setInfo()', () => {
    it('updates the info', () => {
      const field = createField({ info: 'Old' })

      field.setInfo('New Info')

      expect(field.info).toBe('New Info')
    })

    it('returns the same instance for chaining', () => {
      const field = createField()

      expect(field.setInfo('New')).toBe(field)
    })
  })

  // ─── setValidationRules ──────────────────────────────────────────────────────

  describe('setValidationRules()', () => {
    it('updates validationRules', () => {
      const field = createField({ validationRules: { required: true } })
      const newRules: IValidationConfig = { required: false, min: 5 }

      field.setValidationRules(newRules)

      expect(field.validationRules).toEqual(newRules)
    })

    it('returns the same instance for chaining', () => {
      const field = createField()

      expect(field.setValidationRules({ required: true })).toBe(field)
    })
  })

  // ─── method chaining ─────────────────────────────────────────────────────────

  describe('method chaining', () => {
    it('chains all setters in a single expression', () => {
      const field = createField()

      field
        .setLabel('Chained Label')
        .setPlaceholder('Chained Placeholder')
        .setDescription('Chained Description')
        .setInfo('Chained Info')
        .setValidationRules({ required: true, min: 2 })

      expect(field.label).toBe('Chained Label')
      expect(field.placeholder).toBe('Chained Placeholder')
      expect(field.description).toBe('Chained Description')
      expect(field.info).toBe('Chained Info')
      expect(field.validationRules).toEqual({ required: true, min: 2 })
    })
  })
})