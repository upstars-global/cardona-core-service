import { describe, it } from 'vitest'
import DateField from '../../../../../../../src/components/templates/BaseList/_components/fields/DateField.vue'
import { setMountComponent } from '../../../../../utils'
import { getTestCases } from '../../../../../templates/shared-tests/date-and-dateTimeField'
import { fullDate } from '../../../../../../../src/utils/date'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountDateField = setMountComponent(DateField)

describe('DateField.vue', () => {
  getTestCases(fullDate).forEach(({ description, props, expectedDate }) => {
    it(description, () => {
      const wrapper = getMountDateField(props)

      if (expectedDate instanceof Date)
        testOn.equalTextValue({ wrapper }, fullDate(expectedDate))
      else
        testOn.equalTextValue({ wrapper }, expectedDate)
    })
  })
})
