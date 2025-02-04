import { beforeEach, describe, it } from 'vitest'
import CommentField from '../../../../../../../src/components/templates/BaseList/_components/fields/CommentField.vue'
import { setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountCommentField = setMountComponent(CommentField)

const defaultProps = {
  value: 'Comment field value',
}

const commentTextTestId = 'comment-text'
const commentTextTooltipTestId = 'comment-text-tooltip'

let props

describe('TableFields.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders component with filled value data', () => {
    const wrapper = getMountCommentField(props)

    testOn.existTextValue({ wrapper, testId: commentTextTestId }, props.value)
    testOn.equalTextValue({ wrapper, testId: commentTextTooltipTestId }, props.value)
  })

  it('Renders when value is empty', () => {
    props.value = ''

    const wrapper = getMountCommentField(props)

    testOn.existTextValue({ wrapper, testId: commentTextTestId }, '-')
    testOn.notExistElement({ wrapper, testId: commentTextTooltipTestId })
  })
})
