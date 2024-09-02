import { describe, expect, it } from 'vitest'
import DateField from '../../../../src/components/templates/_components/DateField.vue'
import { setMountComponent } from '../../utils'

const getMountDateField = setMountComponent(DateField)

describe('DateField', () => {
  const testCases = [
    {
      /// When props is empty
      description: 'Renders "-" when date is undefined',
      props: {},
      expectedText: '-',
      expectedDate: undefined,
    },
    {
      /// When date is sting
      description: 'Renders the correct date when a valid date string is provided',
      props: { date: '2023-09-01' },
      expectedText: '1693526400000',
      expectedDate: new Date('2023-09-01'),
    },
    {
      /// When is using new Date
      description: 'Renders the correct date when a Date object is provided',
      props: { date: new Date('2023-09-01') },
      expectedText: '1693526400000',
      expectedDate: new Date('2023-09-01'),
    },
    {
      /// When date props is invalid
      description: 'Renders empty string when an invalid date string is provided',
      props: { date: 'invalid-date-string' },
      expectedText: '',
      expectedDate: '',
    },
  ]

  testCases.forEach(({ description, props, expectedText, expectedDate }) => {
    it(description, () => {
      const wrapper = getMountDateField(props)

      if (expectedDate instanceof Date)
        expect(wrapper.vm.fullDate).toEqual(expectedDate)
      else
        expect(wrapper.text()).toBe(expectedText)
    })
  })
})
