import { describe, expect, it } from 'vitest'
import type {BaseWrapper, VueWrapper} from '@vue/test-utils'
import CheckField from '../../../../src/components/templates/FieldGenerator/_components/CheckField.vue'
import { CheckBaseField } from '../../../../src/@model/templates/baseField'
import { getWrapperElement, setMountComponent } from '../../utils'
import { testOn } from '../shared-tests/test-case-generator'

const getMountCheckField = setMountComponent(CheckField)

describe('CheckField.vue', () => {
  const field = new CheckBaseField({
    label: 'Test Checkbox',
    value: false,
    key: 'test-check',
  })

  const defaultProps = {
    modelValue: false,
    disabled: false,
    field,
  }

  const getCheckBoxElement = (wrapper: VueWrapper): BaseWrapper<Node> => getWrapperElement({ wrapper, selector: 'input[type="checkbox"]' })

  it('Renders the checkbox with the correct label', () => {
    const wrapper = getMountCheckField(defaultProps)

    testOn.equalTextValue({ wrapper, selector: 'label' }, 'Test Checkbox')
  })
  it('Binds modelValue to checkbox and emits update on change', async () => {
    const wrapper = getMountCheckField(defaultProps)
    const checkbox = getCheckBoxElement(wrapper)

    expect(checkbox.element.checked).toBe(false)

    await checkbox.setChecked(true)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('Exist is disabled state', async () => {
    const wrapper = getMountCheckField({ ...defaultProps, disabled: true })

    const checkbox = getCheckBoxElement(wrapper)

    testOn.isEqual({ wrapper: checkbox.element.disabled }, true)
  })

  it('Updates modelValue correctly when the prop changes', async () => {
    const wrapper = getMountCheckField(defaultProps)

    const checkbox = getCheckBoxElement(wrapper)

    testOn.isEqual({ wrapper: checkbox.element.checked }, false)
    await wrapper.setProps({ modelValue: true })
    testOn.isEqual({ wrapper: checkbox.element.checked }, true)
  })
})
