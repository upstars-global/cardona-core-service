import { describe, it } from 'vitest'
import DateWithSecondsField from '../../../../src/components/templates/_components/DateWithSecondsField.vue'

import { setMountComponent, testOnEqualTextValue } from '../../utils'

import { fullDate, fullDateWithSeconds } from '../../../../src/utils/date'
import { getTestCases } from '../shared-tests/date-and-dateTimeField'

const getMountDateField = setMountComponent(DateWithSecondsField)

describe('DateFieldWithSeconds', () => {
  getTestCases(fullDateWithSeconds).forEach(({ description, props, expectedDate }) => {
    it(description, () => {
      const wrapper = getMountDateField(props)

      if (expectedDate instanceof Date)
        testOnEqualTextValue({ wrapper }, fullDate(expectedDate))
      else
        testOnEqualTextValue({ wrapper }, expectedDate)
    })
  })
})
