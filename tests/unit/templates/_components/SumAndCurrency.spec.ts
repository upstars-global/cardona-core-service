import { describe, expect, it } from 'vitest'
import SumAndCurrency from '../../../../src/components/templates/_components/SumAndCurrency.vue'
import { findByTestId, getSelectorTestId, setMountComponent } from '../../utils'
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

    expect(true).toBeTruthy()

    expect(wrapper.text()).toContain(getCurrency(data.amount))
    expect(wrapper.text()).toContain(Currency.USD)
  })

  it('Renders the correct element with empty amount', () => {
    const wrapper = getMountSumAndCurrency({ data: {} })

    expect(wrapper.text()).toContain('0')
  })

  it('Renders the remainder when it is present', () => {
    const wrapper = getMountSumAndCurrency({ data: { ...data, remainder: 50 } })

    expect(findByTestId(wrapper, 'data-remainder-value').text()).toBe(getCurrency(50))

    expect(findByTestId(wrapper, 'data-remainder-label').text()).toContain(t('common.remainder'))
  })

  it('Does not render the remainder section when remainder is not provided', () => {
    const wrapper = getMountSumAndCurrency({ data })

    expect(wrapper.findAll(getSelectorTestId('data-remainder')).length).toBeFalsy()
  })
})
