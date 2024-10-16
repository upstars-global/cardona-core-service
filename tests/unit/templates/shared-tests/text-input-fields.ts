import type { VueWrapper } from '@vue/test-utils'
import { testOn } from './test-case-generator'

export const testOnValidPlaceholder = (wrapper: VueWrapper, value: string) => {
  testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, value)
}
