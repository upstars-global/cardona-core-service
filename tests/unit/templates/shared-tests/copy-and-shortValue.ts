// sharedTests.ts

import { expect, it } from 'vitest'
import { copyToClipboard } from '../../../../src/helpers/clipboard'
import { getShortString } from '../../../../src/helpers'
import { testOn } from './test-case-generator'

interface CopyAndShortValueTestsConfig {
  value: string
  componentName: string
  selectorActivationCopy: string
}

export const copyAndShortValueTests = (
  getMountComponent: Function,
  { value, componentName, selectorActivationCopy }: CopyAndShortValueTestsConfig) => {
  it(`renders correctly with value in ${componentName}`, () => {
    const wrapper = getMountComponent({ value })

    testOn.existTextValue({ wrapper }, value)
  })

  it(`renders the short value when isShort is true in ${componentName}`, () => {
    const wrapper = getMountComponent({
      value,
      isShort: true,
    })

    testOn.existTextValue({ wrapper }, getShortString(value))
  })

  it(`calls copyToClipboard with the correct value when clicked in ${componentName}`, async () => {
    const wrapper = getMountComponent({ value })

    await wrapper.find(selectorActivationCopy).trigger('click')
    expect(copyToClipboard).toHaveBeenCalledWith(value)
  })
}
