import { describe, it } from 'vitest'
import CopyField from '../../../../src/components/templates/_components/CopyField.vue'
import {
  getSelectorTestId,
  setMountComponent,
} from '../../utils'
import { copyAndShortValueTests } from '../shared-tests/copy-and-shortValue'
import { testOn } from '../shared-tests/test-case-generator'

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

    testOn.equalTextValue({ wrapper }, value)
    testOn.existElement({ wrapper, testId: 'copy-field-icon' })
  })

  it('Not renders the value and icon when exist value', () => {
    const wrapper = getMountCopyField({
      value: '',
    })

    testOn.notExistText({ wrapper })
  })
})
