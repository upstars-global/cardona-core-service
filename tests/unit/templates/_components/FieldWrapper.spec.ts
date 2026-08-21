import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { cloneDeep } from 'lodash'
import { Field } from 'vee-validate'
import FieldWrapper from '../../../../src/components/templates/_components/FieldWrapper.vue'
import { setMountComponent } from '../../utils'
import { testOn } from '../shared-tests/test-case-generator'

vi.mock('vee-validate', () => ({
  Field: {
    template: '<div><slot :errorMessage="errorMessage" /></div>',
    props: ['name', 'label', 'rules', 'validateOnBlur', 'validateOnChange', 'validateOnInput', 'validateOnModelUpdate'],
    data() {
      return { errorMessage: '' }
    },
  },
}))

const getMountFieldWrapper = setMountComponent(FieldWrapper)

const createDefaultProps = (overrides = {}) => ({
  modelValue: '',
  field: {
    id: 'test-field',
    label: 'Test Label',
    rules: { required: true },
  },
  ...overrides,
})

describe('FieldWrapper.vue', () => {
  let props

  beforeEach(() => {
    props = cloneDeep(createDefaultProps())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ─── label ──────────────────────────────────────────────────────────────────

  describe('label', () => {
    it('renders label text when field.label is provided', () => {
      const wrapper = getMountFieldWrapper(props)

      testOn.existElement({ wrapper, testId: 'field-label' })
      testOn.equalTextValue({ wrapper, testId: 'field-label' }, props.field.label)
    })

    it('does not render label when field.label is empty', () => {
      const wrapper = getMountFieldWrapper(createDefaultProps({
        field: { id: 'f', label: '', rules: {} },
      }))

      testOn.notExistElement({ wrapper, testId: 'field-label' })
    })
  })

  // ─── required indicator ──────────────────────────────────────────────────────

  describe('required indicator', () => {
    it('adds required class when rules.required is true', () => {
      const wrapper = getMountFieldWrapper(props)

      testOn.existClass({ wrapper, testId: 'field-label' }, 'field-generator-label--required')
    })

    it('does not add required class when rules.required is false', () => {
      const wrapper = getMountFieldWrapper(createDefaultProps({
        field: { id: 'f', label: 'L', rules: { required: false } },
      }))

      testOn.notExistClasses({ wrapper, testId: 'field-label' }, 'field-generator-label--required')
    })

    it('does not add required class when rules are not provided', () => {
      const wrapper = getMountFieldWrapper(createDefaultProps({
        field: { id: 'f', label: 'L' },
      }))

      testOn.notExistClasses({ wrapper, testId: 'field-label' }, 'field-generator-label--required')
    })
  })

  // ─── error message ───────────────────────────────────────────────────────────

  describe('error message', () => {
    it('does not show error element when there is no error', () => {
      const wrapper = getMountFieldWrapper(props)

      testOn.notExistElement({ wrapper, testId: 'field-error' })
    })

    it('shows error element when vee-validate reports an error', async () => {
      const wrapper = getMountFieldWrapper(props)

      wrapper.findComponent(Field).vm.errorMessage = 'Validation failed'
      await nextTick()

      testOn.existElement({ wrapper, testId: 'field-error' })
    })

    it('displays the raw error message for non-required errors', async () => {
      const wrapper = getMountFieldWrapper(props)

      wrapper.findComponent(Field).vm.errorMessage = 'Custom validation error'
      await nextTick()

      testOn.equalTextValue({ wrapper, testId: 'field-error' }, 'Custom validation error')
    })

    it('hides error element when errorMessage is cleared', async () => {
      const wrapper = getMountFieldWrapper(props)
      const field = wrapper.findComponent(Field)

      field.vm.errorMessage = 'Some error'
      await nextTick()
      testOn.existElement({ wrapper, testId: 'field-error' })

      field.vm.errorMessage = ''
      await nextTick()
      testOn.notExistElement({ wrapper, testId: 'field-error' })
    })
  })

  // ─── slot ────────────────────────────────────────────────────────────────────

  describe('slot', () => {
    it('renders default slot content', () => {
      const wrapper = getMountFieldWrapper(
        props,
        {},
        { default: () => h('span', { 'data-test-id': 'slot-content' }, 'Slot Text') },
      )

      testOn.existElement({ wrapper, testId: 'slot-content' })
      testOn.equalTextValue({ wrapper, testId: 'slot-content' }, 'Slot Text')
    })

    it('passes error-message from Field to the error-message slot', async () => {
      const wrapper = getMountFieldWrapper(
        props,
        {},
        {
          'error-message': ({ errorMessage }) =>
            h('span', { 'data-test-id': 'slot-error-display' }, errorMessage),
        },
      )

      wrapper.findComponent(Field).vm.errorMessage = 'passed error'
      await nextTick()

      testOn.equalTextValue({ wrapper, testId: 'slot-error-display' }, 'passed error')
    })
  })

  // ─── v-model ─────────────────────────────────────────────────────────────────

  describe('v-model', () => {
    it('emits update:modelValue when the inner Field emits it', async () => {
      const wrapper = getMountFieldWrapper(props)

      testOn.isNotCalledEmittedEvent({ wrapper })

      await wrapper.findComponent(Field).vm.$emit('update:modelValue', 'new value')

      testOn.isCalledEmittedEvent({ wrapper })
      testOn.isEqualEmittedValue({ wrapper }, [['new value']])
    })
  })
})
