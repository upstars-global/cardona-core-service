import { beforeEach, describe, it } from 'vitest'
import ButtonField from '../../../../../../../src/components/templates/BaseList/_components/fields/ButtonField.vue'
import { setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountButtonField = setMountComponent(ButtonField)

const defaultProps = {
  btnName: 'Some name',
}

const expectedClass = 'btn-table'

let props

describe('TableFields.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders component with btnName value', () => {
    const wrapper = getMountButtonField(props)

    testOn.equalTextValue({ wrapper }, props.btnName)
    testOn.existClass({ wrapper }, expectedClass)
  })
  it('Renders component with empty btnName', () => {
    props.btnName = ''

    const wrapper = getMountButtonField(props)

    testOn.equalTextValue({ wrapper }, '')
    testOn.notExistClasses({ wrapper }, expectedClass)
  })
})
