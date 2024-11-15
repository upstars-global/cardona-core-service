import { beforeEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { setMountComponentSelect } from '../shared-tests/select-field'
import NumberRangeField from '../../../../src/components/templates/FieldGenerator/_components/NumberRangeField.vue'
import { getWrapperElement } from '../../utils'
import {
  testActiveErrorAndDisabled,
  testDefaultStateErrorAndDisabled,
  testRenderContentItems,
} from '../shared-tests/number-field'
import { expectedEmitValue } from '../shared-tests/general'
import { testOn } from '../shared-tests/test-case-generator'

const getMountNumberRangeField = setMountComponentSelect(NumberRangeField)

let props

const field = {
  placeholder: 'Some number value',
  append: '%',
}

const defaultProps = {
  modelValue: '',
  field,
}

const inputRangeTestIds = ['from', 'to']

beforeEach(() => {
  props = defaultProps
})

describe('NumberRangeField', () => {
  it('Check render content items ', async () => {
    const wrapper = getMountNumberRangeField(props)
    const inputsRange = inputRangeTestIds.map(testId => getWrapperElement({ wrapper, testId }))

    /// Test input from
    await testRenderContentItems(inputsRange[0], { props, placeholder: `${field.placeholder} From` })

    /// Test input to
    await testRenderContentItems(inputsRange[1], { props, placeholder: `${field.placeholder} To` })

    inputsRange.forEach(testDefaultStateErrorAndDisabled)

    await wrapper.setProps({ disabled: true, errors: true })

    inputsRange.forEach(testActiveErrorAndDisabled)
  })

  it('Is working update model value ', async () => {
    const wrapper = getMountNumberRangeField(props)
    const testValue = { from: 10, to: 12 }

    await wrapper.setValue(testValue)
    expectedEmitValue(wrapper, testValue)

    await wrapper.setProps({ modelValue: testValue })
    inputRangeTestIds.map(key => {
      const wrapperInput = getWrapperElement({ wrapper, testId: key })

      testOn.inputAttributeValueToBe({ wrapper: wrapperInput, selector: 'input' }, testValue[key].toString())
    })
  })

  it('Check on only integer numbers ', async () => {
    props.field.isIntegerNumbers = true

    const wrapper = getMountNumberRangeField(props)

    const testValue = '123.12'

    for (const key of inputRangeTestIds) {
      const index = inputRangeTestIds.indexOf(key)
      const wrapperInput: VueWrapper = getWrapperElement({ wrapper, testId: key })

      await wrapperInput.find('input').setValue(testValue)
      expect(wrapper.emitted('update:modelValue')[index][0][key]).toBe(testValue.replace('.', ''))
    }
  })

  it('Check on only positive numbers ', async () => {
    props.field.withPositiveNumbers = true

    const wrapper = getMountNumberRangeField(props)

    const testValue = '-123'

    for (const key of inputRangeTestIds) {
      const index = inputRangeTestIds.indexOf(key)
      const wrapperInput: VueWrapper = getWrapperElement({ wrapper, testId: key })

      await wrapperInput.find('input').setValue(testValue)
      expect(wrapper.emitted('update:modelValue')[index][0][key]).toBe(testValue.replace('-', ''))
    }
  })
})
