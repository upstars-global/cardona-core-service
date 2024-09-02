import { describe, expect, it } from 'vitest'
import DateField from '../../../../src/components/templates/_components/DateField.vue'
import { setMountComponent } from '../../utils'
import { fullDate } from '../../../../src/utils/date'
import { getTestCases } from '../shared-tests/date-and-dateTimeField'

const getMountDateField = setMountComponent(DateField)

describe('DateField', () => {
  getTestCases(fullDate).forEach(({ description, props, expectedDate }) => {
    it(description, () => {
      const wrapper = getMountDateField(props)

      if (expectedDate instanceof Date)
        expect(wrapper.text()).toEqual(fullDate(expectedDate))

      else
        expect(wrapper.text()).toBe(expectedDate)
    })
  })
})
