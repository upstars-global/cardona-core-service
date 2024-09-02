import { describe, expect, it } from 'vitest'
import CopyField from '../../../../src/components/templates/_components/CopyField.vue'
import { getSelectorTestId, setMountComponent } from '../../utils'
import { copyAndShortValueTests } from '../shared-tests/copy-and-shortValue'

const getMountCopyField = setMountComponent(CopyField)

const value = 'Copy field value'

describe('CopyField', () => {
  copyAndShortValueTests(getMountCopyField, {
    value,
    selectorActivationCopy: getSelectorTestId('copy-field-icon'),
    componentName: 'CopyField',

  })

  it('Renders the value and icon when exist value', () => {
    const wrapper = getMountCopyField({
      value,
    })

    const icon = wrapper.find(getSelectorTestId('copy-field-icon'))

    expect(wrapper.text()).toContain(value)
    expect(icon.exists()).toBeTruthy()
  })

  it('Not renders the value and icon when exist value', () => {
    const wrapper = getMountCopyField({
      value: '',
    })

    const icon = wrapper.find(getSelectorTestId('copy-field-icon'))

    expect(icon.exists()).toBeFalsy()
    expect(wrapper.text()).toBeFalsy()
  })
})
