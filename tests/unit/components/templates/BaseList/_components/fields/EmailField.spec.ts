import { beforeEach, describe, it } from 'vitest'
import EmailField from '../../../../../../../src/components/templates/BaseList/_components/fields/EmailField.vue'
import { setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountEmailField = setMountComponent(EmailField)

const defaultProps = {
  item: { id: '0123456789', name: 'Detail', email: 'test@test.com' },
  getUpdateRoute: item => ({ name: item.name, params: { id: item.id } }),
}

let props

describe('NameWithShortIdField.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders email link when exist name ', () => {
    const wrapper = getMountEmailField(props)

    testOn.existTextValue({ wrapper, testId: 'email-link' }, props.item.email)
  })

  it('Renders email link when not exist name ', () => {
    props.item.name = null

    const wrapper = getMountEmailField(props)

    testOn.existTextValue({ wrapper, testId: 'email-text' }, props.item.email)
  })
})
