import { describe, it } from 'vitest'
import DateWithSecondsField from '../../../../../../../src/components/templates/BaseList/_components/fields/DateWithSecondsField.vue'
import { setMountComponent } from '../../../../../utils'
import { getTestCases } from '../../../../../templates/shared-tests/date-and-dateTimeField'
import { fullDate, fullDateWithSeconds } from '../../../../../../../src/utils/date'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountDateWithSecondsField = setMountComponent(DateWithSecondsField)

describe('DateWithSecondsField.vue', () => {
  getTestCases(fullDate).forEach(({ description, props }) => {
    it(description, () => {
      const wrapper = getMountDateWithSecondsField({
        date: new Date(props.date),
      })

      testOn.equalTextValue({ wrapper }, fullDateWithSeconds(new Date(props.date)))
    })
  })
})
