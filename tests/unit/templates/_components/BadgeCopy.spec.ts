import { describe, expect, it, vi } from 'vitest'
import BadgeCopy from '../../../../src/components/templates/_components/BadgeCopy.vue'
import { copyToClipboard } from '../../../../src/helpers/clipboard'
import { getProps, setMountComponent } from '../../utils'
import { getShortString } from '../../../../src/helpers'

vi.mock('../../../../src/helpers/clipboard', () => ({
  copyToClipboard: vi.fn(),
}))

const getMountBadgeCopy = setMountComponent(BadgeCopy)

const value = '1234567890'

describe('BadgeCopy', () => {
  it('renders correctly with value', () => {
    const wrapper = getMountBadgeCopy({ value })

    expect(wrapper.text()).toContain(value)

    expect(wrapper.findComponent({ name: 'VIcon' }).exists()).toBe(true)
  })

  it('renders the short value when isShort is true', () => {
    const wrapper = getMountBadgeCopy({
      value,
      isShort: true,
      maxLengthForShort: 8,
    })

    expect(wrapper.text()).toContain(getShortString(value))
  })

  it('does not render the label when isViewLabel is false', () => {
    const wrapper = getMountBadgeCopy({
      value,
      isViewLabel: false,
    })

    expect(wrapper.text()).not.toContain('ID:')
  })

  it('calls copyToClipboard with the correct value when clicked', async () => {
    const wrapper = getMountBadgeCopy({ value })

    await wrapper.find('.copy-badge').trigger('click')
    expect(copyToClipboard).toHaveBeenCalledWith(value)
  })

  it('renders "-" when value is falsy', () => {
    const wrapper = getMountBadgeCopy(getProps({ value: '' }))

    expect(wrapper.text()).toBe('-')
  })
})
