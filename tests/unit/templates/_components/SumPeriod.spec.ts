import { describe, it } from 'vitest'
import SumAndCurrency from '../../../../src/components/templates/_components/SumAndCurrency.vue'
import {
  setMountComponent,
} from '../../utils'
import { getCurrency } from '../../../../src/directives/currency'
import { t } from '../shared-tests/locales'
import { Currency } from '../../../../src/@model/enums/currency'
import { testOn } from '../shared-tests/test-case-generator'

const getMountSumAndCurrency = setMountComponent(SumAndCurrency)

const data = {
  amount: 100,
  currency: Currency.USD,
}

describe('SumAndCurrency', () => {
  it('Renders the correct amount and currency', () => {
    const wrapper = getMountSumAndCurrency({ data })

    testOn.equalTextValue({ wrapper }, `${getCurrency(data.amount)}${Currency.USD}`)
  })

  it('Renders the correct element with empty amount', () => {
    const wrapper = getMountSumAndCurrency({ data: {} })

    testOn.equalTextValue({ wrapper }, '0')
  })

  it('Renders the remainder when it is present', () => {
    const wrapper = getMountSumAndCurrency({ data: { ...data, remainder: 50 } })

    testOn.equalTextValue({ wrapper, testId: 'data-remainder-value' }, getCurrency(50))
    testOn.existTextValue({ wrapper, testId: 'data-remainder-label' }, t('common.remainder'))
  })
})
