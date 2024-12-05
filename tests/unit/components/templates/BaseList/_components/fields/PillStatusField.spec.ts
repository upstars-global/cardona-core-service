import { beforeEach, describe, it } from 'vitest'
import PillStatusField from '../../../../../../../src/components/templates/BaseList/_components/fields/PillStatusField.vue'
import { setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountPillStatusField = setMountComponent(PillStatusField)

const defaultProps = {
  isActive: false,
}

const testId = 'pill-status'

let props

describe('PillStatusField.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Check default status of component ', () => {
    const wrapper = getMountPillStatusField(props)

    testOn.existClass({ wrapper, testId }, 'inactive')
  })

  it('Check exist class when prop isActive true ', () => {
    props.isActive = true

    const wrapper = getMountPillStatusField(props)

    testOn.existClass({ wrapper, testId }, 'active')
  })
})
