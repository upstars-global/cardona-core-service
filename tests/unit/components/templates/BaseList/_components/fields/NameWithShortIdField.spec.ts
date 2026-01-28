import { beforeEach, describe, it, vi } from 'vitest'
import NameWithShortIdField from '../../../../../../../src/components/templates/BaseList/_components/fields/NameWithShortIdField.vue'
import { setMountComponent } from '../../../../../utils'
import {
  checkBaseTestCaseForNameWithId,
  defaultProps,
  global,
  testIds,
} from '../../../../../templates/shared-tests/name-with-short-id'
import { getShortString } from '../../../../../../../src/helpers'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountNameWithShortIdField = setMountComponent(NameWithShortIdField)

vi.mock('../../../../../../../src/stores/user', () => ({
  useUserStore: () => ({
    userInfo: {
      id: defaultProps.item.id,
    },
  }),
}))

let props

describe('NameWithShortIdField.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  /// Run test which are common for NameWithIdField and NameWithShortIdField
  checkBaseTestCaseForNameWithId(getMountNameWithShortIdField)

  it('Renders content in default state', () => {
    const wrapper = getMountNameWithShortIdField(props, global)

    testOn.existTextValue({ wrapper, testId: testIds.link }, props.item.name)
    testOn.existTextValue({ wrapper, testId: testIds.copyField }, getShortString(props.item.id.toString()))
  })

  it('Correct render slot content ', () => {
    const slotText = 'Slot content'

    const slot = {
      default: `<div data-test-id="slot-content">${slotText}</div>`,
    }

    const wrapper = getMountNameWithShortIdField(props, global, slot)

    testOn.existTextValue({ wrapper, testId: testIds.slotContent }, slotText)

    /// Check that the id content is displayed
    testOn.existTextValue({ wrapper, testId: testIds.copyField }, getShortString(props.item.id.toString()))
  })
})
