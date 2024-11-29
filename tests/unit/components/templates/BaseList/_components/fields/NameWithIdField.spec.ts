import { beforeEach, describe, it } from 'vitest'
import NameWithIdField from '../../../../../../../src/components/templates/BaseList/_components/fields/NameWithIdField.vue'
import { setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountNameWithIdField = setMountComponent(NameWithIdField)

const defaultProps = {
  item: { id: '0123456789', name: 'Detail' },
  getUpdateRoute: item => ({ name: item.name, params: { id: item.id } }),
  isShowYou: false,
  isShort: false,
}

let props

describe('NameWithField.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders content in default state', () => {
    const wrapper = getMountNameWithIdField(props)

    testOn.existTextValue({ wrapper, testId: 'link' }, props.item.name)
    testOn.existTextValue({ wrapper, testId: 'copy-field' }, props.item.id.toString())
  })
})
