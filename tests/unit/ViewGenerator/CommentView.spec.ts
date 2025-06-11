import { describe, it } from 'vitest'
import CommentView from '../../../src/components/templates/ViewGenerator/_components/CommentView.vue'
import { setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'

const mockViewInfo = {
  value: 'Test Value',
}

const getMountCommentView = setMountComponent(CommentView)
const testId = 'comment'

describe('CommentView', () => {
  it('Renders when value exist ', () => {
    const wrapper = getMountCommentView({ item: mockViewInfo })

    testOn.equalTextValue({ wrapper, testId }, mockViewInfo.value)
  })
  it('Renders when value not exist ', () => {
    const wrapper = getMountCommentView({ item: { value: '' } })

    testOn.notExistTextValue({ wrapper, testId }, mockViewInfo.value)
    testOn.equalTextValue({ wrapper, testId }, '-')
  })
})
