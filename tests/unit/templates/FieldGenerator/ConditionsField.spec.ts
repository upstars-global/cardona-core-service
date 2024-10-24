import { describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ConditionsField from '../../../../src/components/templates/FieldGenerator/_components/ConditionsField.vue'
import {getSelectorTestId, getWrapperElement, setMountComponent} from '../../utils'
import { onDisabledInput, testOnValidPlaceholder } from '../shared-tests/text-input-fields'
import en from '../../../../src/plugins/i18n/locales/en.json'
import { testOn } from '../shared-tests/test-case-generator'

const getMountConditionsField = setMountComponent(ConditionsField)

const conditions = Object.keys(en.component.conditions)

const baseSelector = 'textarea'

const defaultProps = {
  modelValue: 'Test text',
  field: {
    value: '1231',
    key: 'test-field',
    label: 'Test Label',
    placeholder: 'Test Placeholder',
    fetchOptions: vi.fn().mockResolvedValue(conditions),
  },
  errors: false,
  disabled: false,
}

const getVariableItemElement = (wrapper: VueWrapper, index = 0): VueWrapper => wrapper.findAll(getSelectorTestId('condition-variable-item'))[index]

describe('ConditionsField.vue', () => {
  it('Renders the condition textarea field with the correct placeholder', () => {
    const wrapper = getWrapperElement({ wrapper: getMountConditionsField(defaultProps), selector: baseSelector })

    testOnValidPlaceholder(wrapper, defaultProps.field.placeholder)
  })

  it('Renders correctly with default props', async () => {
    const wrapper = getMountConditionsField(defaultProps) as VueWrapper
    const textarea = getWrapperElement({ wrapper, selector: baseSelector }) as VueWrapper

    testOn.existElement({ wrapper: textarea })

    testOn.inputAttributeValueToBe({ wrapper: textarea }, defaultProps.modelValue)

    testOnValidPlaceholder(textarea, defaultProps.field.placeholder)
  })

  it('Renders correctly with default props', async () => {
    const wrapper = getMountConditionsField(defaultProps) as VueWrapper
    const textarea = getWrapperElement({ wrapper, selector: baseSelector })

    testOn.existElement({ wrapper: textarea })
    testOn.inputAttributeValueToBe({ wrapper: textarea }, defaultProps.modelValue)

    expect(defaultProps.field.fetchOptions).toHaveBeenCalled()

    await wrapper.vm.$nextTick()

    testOn.checkLengthElements({ wrapper, testId: 'condition-variable-item', all: true }, conditions.length)

    conditions.forEach((conditionText, index) => {
      testOn.equalTextValue({ wrapper, testId: `variable-value-${index}` }, conditionText)
    })
  })

  it('Updates the modelValue when a variable is clicked', async () => {
    const wrapper = getMountConditionsField(defaultProps) as VueWrapper

    await nextTick()

    const conditionItem = getVariableItemElement(wrapper)

    await conditionItem?.trigger('click')

    testOn.isEqualEmittedValue({ wrapper }, [[`${defaultProps.modelValue} ${conditionItem?.text()}`]])
  })

  it('Disables input and variable clicking when disabled is true', async () => {
    const wrapper = getMountConditionsField({ ...defaultProps, disabled: true }) as VueWrapper

    onDisabledInput({ wrapper, selector: 'textarea' })
    testOn.existClass({ wrapper, selector: '.v-row' }, 'pointer-events-none')

    const conditionItem = getVariableItemElement(wrapper)

    await conditionItem?.trigger('click')

    testOn.isEqualEmittedValue({ wrapper }, undefined)
  })
})
