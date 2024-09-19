import type { VueWrapper } from '@vue/test-utils'
import { getCurrency } from '../../../../src/directives/currency'
import { testOnEqualTextValue } from '../../utils'
import { t } from './locales'

export interface SumAndCurrencyParams {
  key: string
  label: string
  value: number
}

export const checkLabelAndValue = (
  wrapper: VueWrapper,
  { key, label, value }: SumAndCurrencyParams,
) => {
  console.log(label)
  testOnEqualTextValue({ wrapper, testId: label }, t(`component.sumPeriod.${key}`).trim())
  testOnEqualTextValue({ wrapper, testId: `data-${key}` }, getCurrency(value))
}
