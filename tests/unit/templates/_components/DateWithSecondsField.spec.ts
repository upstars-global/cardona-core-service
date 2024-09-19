import { describe, it } from 'vitest'
import DateWithSecondsField from '../../../../src/components/templates/_components/DateWithSecondsField.vue'

import { setMountComponent } from '../../utils'

import { fullDate, fullDateWithSeconds } from '../../../../src/utils/date'
import { getTestCases } from '../shared-tests/date-and-dateTimeField'
import { testOn } from '../shared-tests/test-case-generator'

const getMountDateField = setMountComponent(DateWithSecondsField)

describe('DateFieldWithSeconds', () => {
  getTestCases(fullDateWithSeconds).forEach(({ description, props, expectedDate }) => {
    it(description, () => {
      const wrapper = getMountDateField(props)

      if (expectedDate instanceof Date)
        testOn.equalTextValue({ wrapper }, fullDate(expectedDate))
      else
        testOn.equalTextValue({ wrapper }, expectedDate)
    })
  })
})
