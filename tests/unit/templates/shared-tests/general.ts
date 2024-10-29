import type { VueWrapper } from '@vue/test-utils'
import { ExpectMethods, WrapperProperties, testCaseGenerator } from './test-case-generator'
import {expect} from "vitest";

export const isCalledEmitEvent = (wrapper: VueWrapper, actionEmit: string) => {
  testCaseGenerator({
    methodExpect: ExpectMethods.ToBeTruthy,
    property: { name: WrapperProperties.Emitted, value: actionEmit },
  })({ wrapper })
}

export const expectedEmitValue = (wrapper: VueWrapper, value: string | number, indexEmit?: number = 0) => {
  expect(wrapper.emitted()['update:modelValue'][indexEmit][0]).toEqual(value)
}
