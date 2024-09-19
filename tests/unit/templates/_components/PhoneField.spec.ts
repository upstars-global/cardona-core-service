import { describe, it, vi } from 'vitest'
import PhoneField from '../../../../src/components/templates/_components/PhoneField.vue'
import { setMountComponent } from '../../utils'
import { allPhoneCodesWithFlags } from '../../../../src/helpers/countries'
import { testOn } from '../shared-tests/test-case-generator'

vi.mock('vue-cleave-component', () => ({
  default: {},
}))

const getMountPhoneField = setMountComponent(PhoneField)

const props = {
  value: '+3809595959595',
  field: {} as PhoneField,
  disabled: false,
  errors: false,
}

const testId = 'phone-flag'

describe('PhoneField', () => {
  it('Renders correctly flags by number phone', () => {
    const wrapper = getMountPhoneField(props)

    testOn.existElement({ wrapper, testId })

    const expectedFlag = allPhoneCodesWithFlags
      .find(({ phone }) => props.value.substring(0, 4).replace('+', '') === phone)?.flag

    testOn.equalTextValue({ wrapper, testId }, expectedFlag)
  })
})
