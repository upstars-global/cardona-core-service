import type { VueWrapper } from '@vue/test-utils'
import { getWrapperElement } from '../../utils'
import { testOn } from './test-case-generator'

export const testOnValidPlaceholder = (wrapper: VueWrapper, value: string) => {
  testOn.isEqualPlaceholder({ wrapper }, value)
}

export const getPropsWithDisabledTrue = (props: Record<string, unknown>) => ({ ...props, disabled: true })

export const testOnCalledEmittedEvent = async (
  { wrapper, selector }: { wrapper: VueWrapper; selector: 'input' | 'textarea' }, newValue: string) => {
  testOn.isNotCalledEmittedEvent({ wrapper })

  const input = getWrapperElement({ wrapper, selector }) as VueWrapper

  await input.setValue(newValue)

  testOn.isCalledEmittedEvent({ wrapper })
  testOn.isEqualEmittedValue({ wrapper }, [[newValue]])
}

export const onDisabledInput = ({ wrapper, selector }:
{ wrapper: VueWrapper; selector: 'input' | 'textarea' }) => {
  const input = getWrapperElement({ wrapper, selector }) as VueWrapper

  testOn.isDisabledElement({ wrapper: input })
}
