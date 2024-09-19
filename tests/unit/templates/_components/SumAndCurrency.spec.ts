import { describe, it } from 'vitest'
import SumPeriod from '../../../../src/components/templates/_components/SumPeriod.vue'
import {
  setMountComponent,
  testOnEqualTextValue,
  testOnNotExistElement,
} from '../../utils'
import type { SumAndCurrencyParams } from '../shared-tests/sum-and-currency'
import { checkLabelAndValue } from '../shared-tests/sum-and-currency'

const getMountSumPeriod = setMountComponent(SumPeriod)

const data = {
  today: 100,
  week: 700,
  month: 3000,
  currency: 'USD',
}

const testCases: Array<SumAndCurrencyParams> = [
  { key: 'today', label: 'label-today', value: data.today },
  { key: 'week', label: 'label-week', value: data.week },
  { key: 'month', label: 'label-month', value: data.month },
]

describe('SumPeriod', () => {
  it('Renders the correct labels and values', () => {
    const wrapper = getMountSumPeriod({ data })

    testCases.forEach(params => { checkLabelAndValue(wrapper, params) })
  })

  it('Renders the correct currency', () => {
    const wrapper = getMountSumPeriod({ data })

    testCases.forEach(({ key }) => {
      testOnEqualTextValue({ wrapper, testId: `data-${key}-currency` }, data.currency)
    })
  })

  it('Renders without currency when it is not provided', () => {
    const wrapper = getMountSumPeriod({
      data: {
        ...data,
        currency: '',
      },
    })

    testCases.forEach(({ key }) => {
      testOnEqualTextValue({ wrapper, testId: `data-${key}-currency` }, '')
    })
  })
  it('Does not render the remainder section when remainder is not provided', () => {
    const wrapper = getMountSumPeriod({ data })

    testOnNotExistElement({ wrapper, testId: 'data-remainder' })
  })
})
