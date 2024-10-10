import { describe, it } from 'vitest'

import TextView from '../../../src/components/templates/ViewGenerator/_components/TextView.vue'
import { setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'

const getMountTextView = setMountComponent(TextView)

const testId = 'text'

describe('ViewComponent.vue', () => {
  it('Renders the correct value from item prop', () => {
    const mockItem = {
      value: 'Test Value',
    }

    const wrapper = getMountTextView({ item: mockItem })

    testOn.equalTextValue({ wrapper, testId }, mockItem.value)
  })

  it('Renders with the correct class', () => {
    const mockItem = {
      value: 'Another Value',
    }

    const wrapper = getMountTextView({ item: mockItem })

    testOn.equalTextValue({ wrapper, testId }, mockItem.value)
    testOn.existClass({ wrapper, testId }, 'mb-0')
    testOn.existClass({ wrapper, testId }, 'text-color-base')
  })
})
