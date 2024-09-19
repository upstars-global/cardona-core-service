import { describe, it, vi } from 'vitest'
import PhoneField from '../../../../src/components/templates/_components/PhoneField.vue'
import { setMountComponent, testOnEqualTextValue, testOnExistElement } from '../../utils'
import { allPhoneCodesWithFlags } from '../../../../src/helpers/countries'

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

    testOnExistElement({ wrapper, testId })

    const expectedFlag = allPhoneCodesWithFlags
      .find(({ phone }) => props.value.substring(0, 4).replace('+', '') === phone)?.flag

    testOnEqualTextValue({ wrapper, testId }, expectedFlag)
  })
})
