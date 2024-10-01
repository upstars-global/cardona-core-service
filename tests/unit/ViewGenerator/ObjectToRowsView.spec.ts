import { describe, expect, it } from 'vitest'
import ObjectToRowsView from '../../../src/components/templates/ViewGenerator/_components/ObjectToRowsView.vue'
import { setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'

const getMountCommentView = setMountComponent(ObjectToRowsView)

describe('Component.vue', () => {
  it('renders item values correctly', () => {
    const mockItem = {
      value: {
        name: 'John Doe',
        age: 30,
        job: 'Developer',
      },
    }

    const wrapper = getMountCommentView({ item: mockItem })

    testOn.existTextValue({ wrapper }, mockItem.value.name)
    testOn.existTextValue({ wrapper }, mockItem.value.age)
    testOn.existTextValue({ wrapper }, mockItem.value.job)
  })

  it('renders empty item correctly', () => {
    const mockItem = {
      value: {},
    }

    const wrapper = getMountCommentView({ item: mockItem })

    expect(wrapper.text()).toBe('')
  })
})
