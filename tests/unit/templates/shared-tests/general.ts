import type { VueWrapper } from '@vue/test-utils'
import { expect } from 'vitest'

export const expectedEmitValue = (wrapper: VueWrapper, value: unknown, indexEmit = 0) => {
  expect(wrapper.emitted()['update:modelValue'][indexEmit][0]).toEqual(value)
}
