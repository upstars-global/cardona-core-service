// sharedTests.ts

import { expect, it } from 'vitest'
import { copyToClipboard } from '../../../../src/helpers/clipboard'
import { getShortString } from '../../../../src/helpers'
import { testOn } from './test-case-generator'

interface CopyAndShortValueTestsConfig {
  value: string
  componentName: string
  selectorActivationCopy: string
  isShortByDefault?: boolean
}

const getExpectedValue = (value, isShortByDefault: boolean) => isShortByDefault ? getShortString(value) : value

export const copyAndShortValueTests = (
  getMountComponent: Function,
  { value, componentName, selectorActivationCopy, isShortByDefault }: CopyAndShortValueTestsConfig) => {
  it(`Renders correctly with value in ${componentName}`, () => {
    const wrapper = getMountComponent({ value })

    testOn.existTextValue({ wrapper }, getExpectedValue(value, isShortByDefault))
  })

  it(`Renders the short value when isShort is true in ${componentName}`, () => {
    const props = isShortByDefault ? { value } : { value, isShort: true }
    const wrapper = getMountComponent(props)

    testOn.existTextValue({ wrapper }, getShortString(value))
  })

  it(`Calls copyToClipboard with the correct value when clicked in ${componentName}`, async () => {
    const wrapper = getMountComponent({ value })

    await wrapper.find(selectorActivationCopy).trigger('click')
    expect(copyToClipboard).toHaveBeenCalledWith(value)
  })
}
