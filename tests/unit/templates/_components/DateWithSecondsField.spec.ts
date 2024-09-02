import { describe, expect, it } from 'vitest'
import DateWithSecondsField from '../../../../src/components/templates/_components/DateWithSecondsField.vue'

import { setMountComponent } from '../../utils'

import { fullDate, fullDateWithSeconds } from '../../../../src/utils/date'
import { getTestCases } from '../shared-tests/date-and-dateTimeField'

const getMountDateField = setMountComponent(DateWithSecondsField)

describe('DateFieldWithSeconds', () => {
  getTestCases(fullDateWithSeconds).forEach(({ description, props, expectedDate }) => {
    it(description, () => {
      const wrapper = getMountDateField(props)

      if (expectedDate instanceof Date)
        expect(wrapper.text()).toEqual(fullDate(expectedDate))

      else expect(wrapper.text()).toBe(expectedDate)
    })
  })
})
