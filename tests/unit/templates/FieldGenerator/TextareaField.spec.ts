import { describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import TextareaField from '../../../../src/components/templates/FieldGenerator/_components/TextareaField.vue'
import { getWrapperElement, setMountComponent } from '../../utils'
import {
  getPropsWithDisabledTrue, onDisabledInput,
  testOnCalledEmittedEvent,
  testOnValidPlaceholder,
} from '../shared-tests/text-input-fields'
import { testOn } from '../shared-tests/test-case-generator'

const getMountTextareaField = setMountComponent(TextareaField)

describe('TextareaField.vue', () => {
  const defaultProps = {
    modelValue: '',
    field: {
      label: 'Test Label',
      maxLength: 2000,
      autoHeight: true,
      counter: false,
    },
    placeholder: 'Test Placeholder',
    disabled: false,
    errors: false,
  }

  it('Renders textarea correctly with default props', () => {
    const wrapper = getWrapperElement({
      wrapper: getMountTextareaField(defaultProps),
      selector: 'textarea',
    }) as VueWrapper

    testOn.existElement({ wrapper })
    testOnValidPlaceholder(wrapper, defaultProps.placeholder)
    testOn.maxLengthAttributeToBe({ wrapper }, defaultProps.field.maxLength.toString())
  })

  it('Updates the modelValue correctly when typing', async () => {
    const newValue = 'Updated value'

    const wrapper = getMountTextareaField(defaultProps) as VueWrapper

    await testOnCalledEmittedEvent({ wrapper, element: 'textarea' }, newValue)
  })

  it('Updates the modelValue correctly when typing', async () => {
    const newValue = 'Updated value'

    const wrapper = getMountTextareaField({ ...defaultProps, modelValue: newValue }) as VueWrapper
    const textarea = getWrapperElement({ wrapper, selector: 'textarea' }) as VueWrapper

    await textarea.trigger('keydown', {
      key: 'Enter',
      shiftKey: false,
    })
    testOn.isEqualEmittedValue({ wrapper }, [[`${newValue}\t\n`]])
  })

  it('Disables the input field when the disabled prop is true', async () => {
    const wrapper = getMountTextareaField(getPropsWithDisabledTrue(defaultProps))

    onDisabledInput({ wrapper, selector: 'textarea' })
  })

  it('should adjust height when autoHeight is enabled', async () => {
    const propsWithAutoHeight = {
      ...defaultProps,
      modelValue: 'Some test text',
    }

    const updatedHeight = 200

    const wrapper = getMountTextareaField(propsWithAutoHeight) as VueWrapper

    const textarea = getWrapperElement({ wrapper, selector: 'textarea' }) as VueWrapper

    /// Add property scrollHeight for change height to  textarea for mock action body method onInput
    Object.defineProperty(textarea.element, 'scrollHeight', { value: 200 })

    await textarea.setValue('Some long text that would cause the textarea to grow\n'.repeat(10))

    /// Specific test case because not use test generation
    expect(textarea.element.style.height).toBe(`${updatedHeight}px`)
  })
})
