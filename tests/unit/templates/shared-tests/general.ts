import type { VueWrapper } from '@vue/test-utils'
import { ExpectMethods, WrapperProperties, testCaseGenerator } from './test-case-generator'

export const isCalledEmitEvent = (wrapper: VueWrapper, actionEmit: string) => {
  testCaseGenerator({
    methodExpect: ExpectMethods.ToBeTruthy,
    property: { name: WrapperProperties.Emitted, value: actionEmit },
  })({ wrapper })
}
