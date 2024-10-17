import type { type BaseWrapper, VueWrapper } from '@vue/test-utils'
import { expect } from 'vitest'
import { getWrapperElement } from '../../utils'
import { testOn } from './test-case-generator'

export const selectorInput = 'input[type="checkbox"]'

export const getCheckBoxElement = (wrapper: VueWrapper): BaseWrapper<Node> => getWrapperElement({ wrapper, selector: selectorInput })

export const testOnValidLabel = (wrapper: VueWrapper<unknown>, value: string) => testOn.equalTextValue({ wrapper }, value)

export const isActiveDisabledState = checkbox => testOn.isEqual({ wrapper: checkbox.element.disabled }, true)

export const testEmitData = async (wrapper, value: Array<unknown>) => {
  const checkbox = getCheckBoxElement(wrapper)

  expect(checkbox.element.checked).toBe(false)

  await checkbox.setChecked(true)

  expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(value)
}
