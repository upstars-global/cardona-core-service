import { describe, it } from 'vitest'
import BadgeView from '../../../src/components/templates/ViewGenerator/_components/BadgeView.vue'
import { setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'

const mockViewInfo = {
  value: 'Test Value',
}

const getMountBadgeView = setMountComponent(BadgeView)
const testId = 'badge-chip'

describe('BadgeView', () => {
  it('Renders the value from item prop and class correctly', () => {
    const wrapper = getMountBadgeView({ item: mockViewInfo })

    testOn.existElement({ wrapper, testId })
    testOn.equalTextValue({ wrapper }, mockViewInfo.value)
    testOn.existClass({ wrapper, testId }, 'v-chip--variant-tonal')
  })
})
