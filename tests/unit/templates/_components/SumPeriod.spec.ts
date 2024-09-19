import { describe, it } from 'vitest'
import SumAndCurrency from '../../../../src/components/templates/_components/SumAndCurrency.vue'
import {
  setMountComponent,
  testOnEqualTextValue,
  testOnExistTextValue,
} from '../../utils'
import { getCurrency } from '../../../../src/directives/currency'
import { t } from '../shared-tests/locales'
import { Currency } from '../../../../src/@model/enums/currency'

const getMountSumAndCurrency = setMountComponent(SumAndCurrency)

const data = {
  amount: 100,
  currency: Currency.USD,
}

describe('SumAndCurrency', () => {
  it('Renders the correct amount and currency', () => {
    const wrapper = getMountSumAndCurrency({ data })

    testOnEqualTextValue({ wrapper }, `${getCurrency(data.amount)}${Currency.USD}`)
  })

  it('Renders the correct element with empty amount', () => {
    const wrapper = getMountSumAndCurrency({ data: {} })

    testOnEqualTextValue({ wrapper }, '0')
  })

  it('Renders the remainder when it is present', () => {
    const wrapper = getMountSumAndCurrency({ data: { ...data, remainder: 50 } })

    testOnEqualTextValue({ wrapper, testId: 'data-remainder-value' }, getCurrency(50))
    testOnExistTextValue({ wrapper, testId: 'data-remainder-label' }, t('common.remainder'))
  })
})
