import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, reactive } from 'vue'
import { Field } from 'vee-validate'
import FieldGenerator from '../../../../src/components/templates/FieldGenerator/index.vue'
import { CheckBaseField, DummySelectBaseField, TextBaseField } from '../../../../src/@model/templates/baseField'
import { i18n } from '../../../../src/plugins/i18n'
import { EventEmittersNames, testOn } from '../shared-tests/test-case-generator'
import { setMountComponent } from '../../utils'

const getMountFieldGenerator = setMountComponent(FieldGenerator)

const mockAbilityCan = vi.fn()

vi.mock('../../../../src/stores/user', () => ({
  useUserStore: () => ({
    abilityCan: mockAbilityCan.mockReturnValue(true),
  }),
}))

vi.mock('../../../../src/stores/useAppConfigCoreStore', () => ({
  useAppConfigCoreStore: () => ({
    allCurrencies: vi.fn(() => ['USD', 'EUR', 'CAD']),
  }),
}))

vi.mock('vee-validate', () => ({
  Field: {
    template: '<div><slot :errorMessage="errorMessage" /></div>',
    props: ['name', 'label', 'rules', 'validateOnBlur', 'validateOnChange', 'validateOnInput', 'validateOnModelUpdate'],
    data() {
      return {
        errorMessage: '',
      }
    },
  },
}))

const defaultProps = {
  modelValue: {
    key: 'test-key',
    id: 'test-id',
    label: 'Test Label',
    value: '',
    placeholder: 'Enter something...',
    description: 'This is a test description.',
    permission: 'test',
    validationRules: {
      required: true,
    },
    component: 'input',
  },
}

const mountFieldGenerator = (props?: unknown) => getMountFieldGenerator({
  ...defaultProps,
  ...props,
  h,
},
{
  stubs: {
    VueSelect: {
      template: '<div><slot></slot></div>',
    },
  },
})

describe('FieldGenerator.vue', () => {
  it('renders correctly with basic props', () => {
    const wrapper = mountFieldGenerator()

    testOn.existElement({ wrapper, selector: '.field-generator-label' })
    testOn.existTextValue({ wrapper, selector: '.field-generator-label' }, 'Test Label')
    testOn.notExistElement({ wrapper, selector: '.field-generator__error' })
  })

  it('renders error message when validation fails', async () => {
    const wrapper = mountFieldGenerator()

    const field = wrapper.findComponent(Field)

    field.vm.errorMessage = 'This field is required'

    await wrapper.vm.$nextTick()
    testOn.equalTextValue({ wrapper, selector: '.field-generator__error' }, 'This field is required')
  })

  it('emits update:modelValue when value changes', async () => {
    const wrapper = mountFieldGenerator()
    const newValue = 'New value'

    wrapper.vm.fieldModel = newValue

    await wrapper.vm.$nextTick()

    testOn.isCalledEmitEventValue(
      { wrapper },
      { event: EventEmittersNames.UpdateVModel, value: { ...defaultProps.modelValue, value: newValue } })
  })

  it('disables input when disabled prop is true', () => {
    const wrapper = mountFieldGenerator({
      modelValue: new TextBaseField({
        key: 'input',
        label: 'Some input',
      }),
      disabled: true,
    })

    testOn.existClass({ wrapper, selector: '.v-field' }, 'v-field--disabled')
  })

  it('shows tooltip if info is provided', () => {
    const wrapper = mountFieldGenerator({
      modelValue: {
        ...defaultProps.modelValue,
        info: 'This is additional info',
      },
    })

    testOn.existElement({ wrapper, selector: '.v-icon' })
  })

  it('calls search event on search', async () => {
    const wrapper = mountFieldGenerator({
      modelValue: new DummySelectBaseField({
        key: 'select',
        label: 'labek',
        options: [],
        value: '',
        placeholder: 'Enter something...',
      }),
    })

    await wrapper.vm.$emit('search', 'test-search')

    testOn.isCalledEmitEvent({ wrapper }, 'search')
    expect(wrapper.emitted('search')[0][0]).toEqual('test-search')
  })

  it('applies validation rules to the field', () => {
    const wrapper = mountFieldGenerator()
    const field = wrapper.findComponent(Field)

    expect(field.props('rules')).toEqual({
      required: true,
    })
  })

  it('hides label when withLabel prop is false', () => {
    const wrapper = mountFieldGenerator({ withLabel: false })

    testOn.notExistElement({ wrapper, selector: '.field-generator-label' })
  })

  it('renders description when no error is present', () => {
    const wrapper = mountFieldGenerator()

    testOn.existElement({ wrapper, testId: 'description' })
    testOn.equalTextValue({ wrapper, testId: 'description' }, defaultProps.modelValue.description)
  })

  it('applies form-required class when validation rule requires it', () => {
    const wrapper = mountFieldGenerator()

    expect(wrapper.find('.form-required').exists()).toBe(true)
  })

  it('renders check-type tooltip when info is provided for check type fields', () => {
    const wrapper = mountFieldGenerator({
      modelValue: new CheckBaseField({
        value: false,
        key: 'check',
        label: i18n.t('page.demo.checkField'),
        info: 'Some text',
      }),
    })

    testOn.existElement({ wrapper, testId: 'info-with-type-check' })
  })

  it('does not render when permission check fails', () => {
    mockAbilityCan.mockImplementation(() => false)
    defaultProps.modelValue.permission = 'test'

    const wrapper = mountFieldGenerator(defaultProps, {
      mocks: {
        canView: false,
      },
    })

    testOn.notExistElement({ wrapper, testId: '.field-generator' })
  })

  describe('BaseField setter methods', () => {
    // Setters mutate the class instance in-place. Plain class properties are
    // not tracked by Vue's reactivity system, so we wrap the field in
    // reactive() before mounting. This causes Vue to intercept property
    // writes (including _label, _info, etc.) and invalidate any computed
    // that reads them — no setProps call needed.

    it('setLabel — FieldGenerator reflects updated label reactively', async () => {
      const field = reactive(new TextBaseField({ key: 'f', label: 'Original' }))
      const wrapper = mountFieldGenerator({ modelValue: field })

      testOn.equalTextValue({ wrapper, selector: '.field-generator-label' }, 'Original')

      field.setLabel('Updated Label')
      await nextTick()

      testOn.equalTextValue({ wrapper, selector: '.field-generator-label' }, 'Updated Label')
    })

    it('setDescription — FieldGenerator reflects updated description reactively', async () => {
      const field = reactive(new TextBaseField({ key: 'f', label: 'L', description: 'Original desc' }))
      const wrapper = mountFieldGenerator({ modelValue: field })

      testOn.equalTextValue({ wrapper, testId: 'description' }, 'Original desc')

      field.setDescription('Updated Description')
      await nextTick()

      testOn.equalTextValue({ wrapper, testId: 'description' }, 'Updated Description')
    })

    it('setInfo — tooltip icon appears reactively after setInfo', async () => {
      const field = reactive(new TextBaseField({ key: 'f', label: 'L' }))
      const wrapper = mountFieldGenerator({ modelValue: field })

      testOn.notExistElement({ wrapper, selector: '.v-icon' })

      field.setInfo('Tooltip text')
      await nextTick()

      testOn.existElement({ wrapper, selector: '.v-icon' })
    })

    it('setValidationRules — vee-validate Field receives updated rules reactively', async () => {
      const field = reactive(new TextBaseField({ key: 'f', label: 'L', validationRules: { required: false } }))
      const wrapper = mountFieldGenerator({ modelValue: field })

      expect(wrapper.findComponent(Field).props('rules')).toEqual({ required: false })

      field.setValidationRules({ required: true, min: 3 })
      await nextTick()

      expect(wrapper.findComponent(Field).props('rules')).toEqual({ required: true, min: 3 })
    })

    it('chained setters — all mutations reflected after nextTick', async () => {
      const field = reactive(new TextBaseField({ key: 'f', label: 'Old Label', description: 'Old Desc' }))
      const wrapper = mountFieldGenerator({ modelValue: field })

      field
        .setLabel('Chain Label')
        .setDescription('Chain Desc')
        .setValidationRules({ required: true })

      await nextTick()

      testOn.equalTextValue({ wrapper, selector: '.field-generator-label' }, 'Chain Label')
      testOn.equalTextValue({ wrapper, testId: 'description' }, 'Chain Desc')
      expect(wrapper.findComponent(Field).props('rules')).toEqual({ required: true })
    })
  })
})
