import type { VueWrapper } from '@vue/test-utils'
import { expect } from 'vitest'

// export const isCalledEmitEvent = (wrapper: VueWrapper, actionEmit: string) => {
//   testCaseGenerator({
//     methodExpect: ExpectMethods.ToBeTruthy,
//     property: { name: WrapperProperties.Emitted, value: actionEmit },
//   })({ wrapper })
// }

export const expectedEmitValue = (wrapper: VueWrapper, value: unknown, indexEmit = 0) => {
  expect(wrapper.emitted()['update:modelValue'][indexEmit][0]).toEqual(value)
}
