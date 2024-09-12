import { describe, expect, it, vi } from 'vitest'
import PhoneField from '../../../../src/components/templates/_components/PhoneField.vue'
import { getSelectorTestId, setMountComponent } from '../../utils'
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

describe('PhoneField', () => {
  it('Renders correctly flags by number phone', () => {
    const wrapper = getMountPhoneField(props)

    const flagElement = wrapper.find(getSelectorTestId('phone-flag'))

    expect(flagElement.exists()).toBe(true)

    const expectedFlag = allPhoneCodesWithFlags
      .find(({ phone }) => props.value.substring(0, 4).replace('+', '') === phone)?.flag

    expect(flagElement.text()).toBe(expectedFlag)
  })
})
