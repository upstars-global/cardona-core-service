export const testingDate = '2023-09-01'

export const getTestCases = (formatDateMethod: (date: Date) => string) => {
  return [
    {
      /// When props is empty
      description: 'Renders "-" when date is undefined',
      props: {},
      expectedDate: '-',
    },
    {
      /// When date is sting
      description: 'Renders the correct date when a valid date string is provided',
      props: { date: testingDate },
      expectedDate: formatDateMethod(new Date(testingDate)),
    },
    {
      /// When is using new Date
      description: 'Renders the correct date when a Date object is provided',
      props: { date: new Date(testingDate) },
      expectedDate: formatDateMethod(new Date(testingDate)),
    },
    {
      /// When date props is invalid
      description: 'Renders empty string when an invalid date string is provided',
      props: { date: 'invalid-date-string' },
      expectedDate: 'Invalid Date',
    },
  ]
}
