import { describe, it } from 'vitest'
import DatePeriodField from '../../../../../../../src/components/templates/BaseList/_components/fields/DatePeriodField.vue'
import { setMountComponent } from '../../../../../utils'
import { getTestCases } from '../../../../../templates/shared-tests/date-and-dateTimeField'
import { fullDate } from '../../../../../../../src/utils/date'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountDatePeriodField = setMountComponent(DatePeriodField)

describe('DatePeriodField.vue', () => {
  getTestCases(fullDate).forEach(({ description, props, expectedDate }) => {
    it(description, () => {
      const wrapper = getMountDatePeriodField({
        period: {
          dateFrom: props.date,
          dateTo: props.date,
        },
      })

      if (expectedDate instanceof Date)
        testOn.equalTextValue({ wrapper }, fullDate(expectedDate) + fullDate(expectedDate))
      else
        testOn.equalTextValue({ wrapper }, expectedDate + expectedDate)
    })
  })
})
