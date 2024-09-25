import { describe, it } from 'vitest'
import DateField from '../../../../src/components/templates/_components/DateField.vue'
import { setMountComponent } from '../../utils'
import { fullDate } from '../../../../src/utils/date'
import { getTestCases } from '../shared-tests/date-and-dateTimeField'
import { testOn } from '../shared-tests/test-case-generator'

const getMountDateField = setMountComponent(DateField)

describe('DateField', () => {
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
