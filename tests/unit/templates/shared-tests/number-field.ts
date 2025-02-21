import type { VueWrapper } from '@vue/test-utils'
import { IconsList } from '../../../../src/@model/enums/icons'
import { getSelectorTestId } from '../../utils'
import { EventEmittersNames, testOn } from './test-case-generator'

export const removeMinus = (value: string): string => value.replace('-', '')
export const removeDot = (value: string): string => value.replace('.', '')

export const testActiveErrorAndDisabled = (wrapper: VueWrapper) => {
  testOn.existClass({ wrapper, selector: '.v-field' }, 'v-field--disabled')
  testOn.existClass({ wrapper, selector: '.v-field__append-inner i' }, IconsList.InfoIcon)
}

export const testDefaultStateErrorAndDisabled = (wrapper: VueWrapper) => {
  testOn.notExistClasses({ wrapper, selector: '.v-field' }, 'v-field--disabled')
  testOn.notExistElement({ wrapper, selector: '.v-field__append-inner i' })
}

export const testRenderContentItems = (wrapper: VueWrapper, { placeholder, props }) => {
  testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, placeholder)
  testOn.equalTextValue({ wrapper, selector: '.v-text-field__suffix__text' }, props.field.append)
}

export const testOnUpdatedValue = async (wrapper: VueWrapper, { valueToSet, expectedValue }) => {
  const getInput = (testId: string) => wrapper.find(getSelectorTestId(testId)).find('input')

  const from = getInput('from')
  const to = getInput('to')

  /// Update input value for input from
  await from.setValue(valueToSet['from'])

  /// Update props with saving state input from
  await wrapper.setProps({ modelValue: wrapper.emitted()['update:modelValue'][0][0] })

  /// Update input value for input to
  await to.setValue(valueToSet['to'])

  /// Check on expected  value
  testOn.isCalledEmitEventValue({ wrapper }, { event: EventEmittersNames.UpdateVModel, value: expectedValue, index: 1 })
}
