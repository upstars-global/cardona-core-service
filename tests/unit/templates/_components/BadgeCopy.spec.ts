import { describe, expect, it } from 'vitest'
import BadgeCopy from '../../../../src/components/templates/_components/BadgeCopy.vue'
import { setMountComponent } from '../../utils'
import { copyAndShortValueTests } from '../shared-tests/copy-and-shortValue'
import { getShortString } from '../../../../src/helpers'

const getMountBadgeCopy = setMountComponent(BadgeCopy)

const value = '1234567890'

describe('BadgeCopy', () => {
  copyAndShortValueTests(getMountBadgeCopy, {
    value,
    selectorActivationCopy: '.copy-badge',
    componentName: 'BadgeCopy',

  })

  it('Renders the short value when isShort is true', () => {
    const wrapper = getMountBadgeCopy({
      value,
      isShort: true,
      maxLengthForShort: 8,
    })

    expect(wrapper.text()).toContain(getShortString(value))
  })

  it('Does not render the label when isViewLabel is false', () => {
    const wrapper = getMountBadgeCopy({
      value,
      isViewLabel: false,
    })

    expect(wrapper.text()).not.toContain('ID:')
  })

  it('Renders "-" when value is falsy', () => {
    const wrapper = getMountBadgeCopy({ value: '' })

    expect(wrapper.text()).toBe('-')
  })
})
