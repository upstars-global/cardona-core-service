import { describe, expect, it } from 'vitest'
import SumPeriod from '../../../../src/components/templates/_components/SumPeriod.vue'
import { setMountComponent, setWrapper } from '../../utils'
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
    const currentElement = setWrapper(wrapper)

    testCases.forEach(params => {
      checkLabelAndValue(currentElement, params)
    })
  })

  it('Renders the correct currency', () => {
    const wrapper = getMountSumPeriod({ data })
    const currentElement = setWrapper(wrapper)

    testCases.forEach(({ key }) => {
      expect(currentElement(`data-${key}-currency`).text()).toContain(data.currency)
    })
  })

  it('Renders without currency when it is not provided', () => {
    const wrapper = getMountSumPeriod({
      data: {
        ...data,
        currency: '',
      },
    })

    const currentElement = setWrapper(wrapper)

    testCases.forEach(({ key }) => {
      expect(currentElement(`data-${key}-currency`).text()).toBe('')
    })
  })
})
