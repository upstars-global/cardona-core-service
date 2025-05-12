import { beforeEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { getWrapperElement, setMountComponent } from '../../utils'
import {
  getPropsWithDisabledTrue, onDisabledInput,
  testOnValidPlaceholder,
} from '../shared-tests/text-input-fields'
import CurrencyField from '../../../../src/components/templates/FieldGenerator/_components/CurrencyField.vue'
import { testOn } from '../shared-tests/test-case-generator'
import { IconsList } from '../../../../src/@model/enums/icons'

const getMountComponent = setMountComponent(CurrencyField)

const defaultProps = {
  modelValue: '',
  field: {
    label: 'Test Label',
    placeholder: 'Test Placeholder',
  },
  errors: false,
  disabled: false,
}

let props

beforeEach(() => {
  props = defaultProps
})

describe('CurrencyField.vue', () => {
  it('Renders the currency field with the correct placeholder', () => {
    const wrapper = getWrapperElement({
      wrapper: getMountComponent(props),
      selector: 'input',
    }) as VueWrapper

    testOnValidPlaceholder(wrapper, defaultProps.field.placeholder)
  })

  it('Should allow input value of string', () => {
    props.modelValue = 'Action + 123'
    props.field.withString = true

    const wrapper = getWrapperElement({
      wrapper: getMountComponent(defaultProps),
    }) as VueWrapper

    expect(wrapper.find('input').element.value).equal(props.modelValue)
    props.field.withString = false
  })

  it('Should allow input value only number value', async () => {
    props.modelValue = 'Action + 123'
    props.field.w = true

    const wrapper = getWrapperElement({
      wrapper: getMountComponent(defaultProps),
    }) as VueWrapper

    /// Check that the value of string is not allowed
    expect(wrapper.find('input').element.value).equal('')

    /// Update props
    const numberValue = '123'

    await wrapper.setProps({ modelValue: numberValue })

    /// Check that input value is corrects
    expect(wrapper.find('input').element.value).equal(numberValue)
  })

  it('Disables the input field when the disabled prop is true', async () => {
    const wrapper = getMountComponent(getPropsWithDisabledTrue(props))

    onDisabledInput({ wrapper, selector: 'input' })
  })

  it('Shows the error icon when errors prop is true and when is false', async () => {
    const selector = '.v-field__append-inner i'

    const wrapper = getMountComponent({ ...props, errors: true })

    const appendInnerBlockIcon = getWrapperElement({ wrapper, selector }) as VueWrapper

    testOn.existClass({ wrapper: appendInnerBlockIcon }, IconsList.InfoIcon)

    await wrapper.setProps({ ...defaultProps, errors: false })

    testOn.notExistElement({ wrapper, selector })
  })

  it('Should render append content', async () => {
    const selector = '.v-text-field__suffix__text'

    props.field.append = 'APPEND_VALUE'

    const wrapper = getMountComponent(props)

    testOn.existTextValue({ wrapper, selector }, props.field.append)
  })
})
