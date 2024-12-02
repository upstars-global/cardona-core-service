import { describe, it } from 'vitest'
import CopyShortField from '../../../../../../../src/components/templates/BaseList/_components/fields/CopyShortField.vue'
import { getSelectorTestId, setMountComponent } from '../../../../../utils'
import { copyAndShortValueTests } from '../../../../../templates/shared-tests/copy-and-shortValue'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'
import { getShortString } from '../../../../../../../src/helpers'

const getMountCopyShortField = setMountComponent(CopyShortField)

const value = 'Copy field value'

const testId = 'copy-field-icon'

describe('CopyShortField.vue', () => {
  copyAndShortValueTests(getMountCopyShortField, {
    value,
    selectorActivationCopy: getSelectorTestId(testId),
    componentName: 'CopyField',
    isShortByDefault: true,
  })

  it('Renders the value and icon when exist value', () => {
    const wrapper = getMountCopyShortField({
      value,
    })

    testOn.equalTextValue({ wrapper }, getShortString(value))
    testOn.existElement({ wrapper, testId })
  })

  it('Not renders the value and icon when exist value', () => {
    const wrapper = getMountCopyShortField({
      value: '',
    })

    testOn.notExistText({ wrapper })
  })
})
