// sharedTests.ts

import { expect, it } from 'vitest'
import { copyToClipboard } from '../../../../src/helpers/clipboard'
import { getShortString } from '../../../../src/helpers'

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

    expect(wrapper.text()).toContain(value)
    expect(wrapper.findComponent({ name: 'VIcon' }).exists()).toBe(true)
  })

  it(`renders the short value when isShort is true in ${componentName}`, () => {
    const wrapper = getMountComponent({
      value,
      isShort: true,
    })

    expect(wrapper.text()).toContain(getShortString(value))
  })

  it(`calls copyToClipboard with the correct value when clicked in ${componentName}`, async () => {
    const wrapper = getMountComponent({ value })

    await wrapper.find(selectorActivationCopy).trigger('click')
    expect(copyToClipboard).toHaveBeenCalledWith(value)
  })
}
