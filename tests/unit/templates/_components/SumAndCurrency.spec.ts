import { describe, it } from 'vitest'
import SumPeriod from '../../../../src/components/templates/_components/SumPeriod.vue'
import {
  setMountComponent,
} from '../../utils'
import type { SumAndCurrencyParams } from '../shared-tests/sum-and-currency'
import { checkLabelAndValue } from '../shared-tests/sum-and-currency'
import { testOn } from '../shared-tests/test-case-generator'

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
      testOn.equalTextValue({ wrapper, testId: `data-${key}-currency` }, data.currency)
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
      testOn.equalTextValue({ wrapper, testId: `data-${key}-currency` }, '')
    })
  })
  it('Does not render the remainder section when remainder is not provided', () => {
    const wrapper = getMountSumPeriod({ data })

    testOn.notExistElement({ wrapper, testId: 'data-remainder' })
  })
})
