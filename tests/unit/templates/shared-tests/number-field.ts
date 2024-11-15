import type { VueWrapper } from '@vue/test-utils'
import { IconsList } from '../../../../src/@model/enums/icons'
import { expectedEmitValue } from './general'
import { testOn } from './test-case-generator'

export const testActiveErrorAndDisabled = (wrapper: VueWrapper) => {
  testOn.existClass({ wrapper, selector: '.v-field' }, 'v-field--disabled')
  testOn.existClass({ wrapper, selector: '.v-field__append-inner i' }, IconsList.InfoIcon)
}

export const testDefaultStateErrorAndDisabled = (wrapper: VueWrapper) => {
  testOn.notExistClasses({ wrapper, selector: '.v-field' }, 'v-field--disabled')
  testOn.notExistElement({ wrapper, selector: '.v-field__append-inner i' })
}

export const testRenderContentItems = async (wrapper: VueWrapper, { placeholder, props }) => {
  testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, placeholder)
  testOn.equalTextValue({ wrapper, selector: '.v-text-field__suffix__text' }, props.field.append)
}

export const testUpdateModelValue = async (wrapper, testValue) => {
  await wrapper.setValue(testValue)
  expectedEmitValue(wrapper, testValue)

  await wrapper.setProps({ modelValue: testValue })
  testOn.inputAttributeValueToBe({ wrapper, selector: 'input' }, testValue)
}

export const testOnlyIntegerNumbers = (wrapper: VueWrapper, testValue: string) => {
  // await wrapper.find('input').setValue(testValue)
  expectedEmitValue(wrapper, testValue.replace('.', ''))
}

export const testOnlyPositiveNumbers = async (wrapper: VueWrapper) => {
  const testValue = '-123'

  await wrapper.find('input').setValue(testValue)
  expectedEmitValue(wrapper, testValue.replace('-', ''))
}
