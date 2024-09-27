import { describe, it } from 'vitest'

import LinkView from '../../../src/components/templates/ViewGenerator/_components/LinkView.vue'

import { setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'

const mockViewInfo = {
  value: 'Test Value',
}

const getMountLinkViewView = setMountComponent(LinkView)
const testId = 'comment'

describe('BadgeView', () => {
  it('Renders when value exist ', () => {
    const wrapper = getMountLinkViewView({ item: mockViewInfo })

    testOn.equalTextValue({ wrapper, testId }, '')
  })
})
